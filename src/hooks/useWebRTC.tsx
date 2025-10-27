import { useEffect, useRef, useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { RealtimeChannel } from '@supabase/supabase-js';

interface WebRTCHookProps {
  roomId: string | null;
  isInitiator: boolean;
}

export const useWebRTC = ({ roomId, isInitiator }: WebRTCHookProps) => {
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [connectionState, setConnectionState] = useState<RTCPeerConnectionState>('disconnected');
  const [isConnecting, setIsConnecting] = useState(false);
  const [isVideoHiddenFromPartner, setIsVideoHiddenFromPartner] = useState(false);
  const peerConnection = useRef<RTCPeerConnection | null>(null);
  const channelRef = useRef<RealtimeChannel | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const videoSenderRef = useRef<RTCRtpSender | null>(null);

  const configuration: RTCConfiguration = {
    iceServers: [
      { urls: 'stun:stun.l.google.com:19302' },
      { urls: 'stun:stun1.l.google.com:19302' },
      { urls: 'stun:stun2.l.google.com:19302' },
      { urls: 'stun:stun3.l.google.com:19302' },
      { urls: 'stun:stun4.l.google.com:19302' },
      // TURN servers for better connectivity
      {
        urls: 'turn:turn.anyfirewall.com:443?transport=tcp',
        credential: 'webrtc',
        username: 'webrtc'
      }
    ],
    iceCandidatePoolSize: 10,
  };

  const initializeMedia = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'user'
        },
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        },
      });
      localStreamRef.current = stream;
      setLocalStream(stream);
      return stream;
    } catch (error) {
      console.error('Error accessing media devices:', error);
      throw error;
    }
  }, []);

  const cleanup = useCallback(() => {
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => track.stop());
      localStreamRef.current = null;
    }
    setLocalStream(null);
    setRemoteStream(null);
    setConnectionState('disconnected');
    setIsConnecting(false);
    setIsVideoHiddenFromPartner(false);

    if (peerConnection.current) {
      peerConnection.current.close();
      peerConnection.current = null;
    }

    if (channelRef.current) {
      supabase.removeChannel(channelRef.current);
      channelRef.current = null;
    }

    videoSenderRef.current = null;
  }, []);

  useEffect(() => {
    if (!roomId) {
      cleanup();
      return;
    }

    initializeMedia();

    return () => {
      cleanup();
    };
  }, [roomId, initializeMedia, cleanup]);

  useEffect(() => {
    if (!roomId) return;

    console.log('Setting up WebRTC for room:', roomId, 'isInitiator:', isInitiator);
    setIsConnecting(true);

    const setupWebRTC = async () => {
      try {
        console.log('Creating RTCPeerConnection');
        peerConnection.current = new RTCPeerConnection(configuration);

        // Add connection state monitoring
        peerConnection.current.onconnectionstatechange = () => {
          const state = peerConnection.current?.connectionState || 'disconnected';
          setConnectionState(state);
          console.log('Connection state changed to:', state);

          if (state === 'connected') {
            setIsConnecting(false);
            console.log('WebRTC connection established successfully');
          } else if (state === 'failed' || state === 'disconnected') {
            setIsConnecting(false);
            console.log('Connection failed or disconnected, state:', state);
          }
        };

        peerConnection.current.oniceconnectionstatechange = () => {
          console.log('ICE connection state:', peerConnection.current?.iceConnectionState);
        };

        // Add tracks when local stream becomes available
        const addTracks = () => {
          if (localStreamRef.current && peerConnection.current) {
            console.log('Adding tracks to peer connection');
            localStreamRef.current.getTracks().forEach(track => {
              console.log(`Adding ${track.kind} track:`, track);
              const sender = peerConnection.current!.addTrack(track, localStreamRef.current!);
              if (track.kind === 'video') {
                videoSenderRef.current = sender;
              }
              console.log(`Successfully added ${track.kind} track to peer connection`);
            });
          } else {
            console.log('Cannot add tracks: localStream or peerConnection not available');
          }
        };

        // Add tracks immediately if stream is available, or wait for it
        if (localStreamRef.current) {
          addTracks();
        } else {
          // Wait for stream to be initialized
          const checkStream = setInterval(() => {
            if (localStreamRef.current && peerConnection.current) {
              addTracks();
              clearInterval(checkStream);
            }
          }, 100);
          setTimeout(() => clearInterval(checkStream), 10000); // Timeout after 10 seconds
        }

        peerConnection.current.ontrack = (event) => {
          console.log('Received remote stream:', event.streams[0]);
          console.log('Remote stream tracks:', event.streams[0].getTracks());
          setRemoteStream(event.streams[0]);
        };

        peerConnection.current.onicecandidate = (event) => {
          if (event.candidate && channelRef.current) {
            channelRef.current.send({
              type: 'broadcast',
              event: 'ice-candidate',
              payload: { candidate: event.candidate },
            });
          }
        };

        channelRef.current = supabase.channel(`webrtc:${roomId}`, {
          config: {
            presence: { key: roomId },
          }
        });

        channelRef.current
          .on('broadcast', { event: 'offer' }, async ({ payload }) => {
            console.log('Received offer:', payload);
            if (!peerConnection.current) return;
            try {
              await peerConnection.current.setRemoteDescription(new RTCSessionDescription(payload.offer));
              const answer = await peerConnection.current.createAnswer();
              await peerConnection.current.setLocalDescription(answer);
              console.log('Sending answer:', answer);
              channelRef.current?.send({
                type: 'broadcast',
                event: 'answer',
                payload: { answer },
              });
            } catch (error) {
              console.error('Error handling offer:', error);
            }
          })
          .on('broadcast', { event: 'answer' }, async ({ payload }) => {
            console.log('Received answer:', payload);
            if (!peerConnection.current) return;
            try {
              await peerConnection.current.setRemoteDescription(new RTCSessionDescription(payload.answer));
            } catch (error) {
              console.error('Error handling answer:', error);
            }
          })
          .on('broadcast', { event: 'ice-candidate' }, async ({ payload }) => {
            console.log('Received ICE candidate:', payload);
            if (!peerConnection.current) return;
            try {
              await peerConnection.current.addIceCandidate(new RTCIceCandidate(payload.candidate));
            } catch (error) {
              console.error('Error adding ICE candidate:', error);
            }
          })
          .subscribe(async (status) => {
            console.log('WebRTC channel status:', status, 'isInitiator:', isInitiator);
            if (status === 'SUBSCRIBED' && isInitiator && peerConnection.current) {
              // Longer delay to ensure tracks are added and both peers are ready
              setTimeout(async () => {
                try {
                  console.log('Creating offer as initiator');
                  const offer = await peerConnection.current!.createOffer();
                  await peerConnection.current!.setLocalDescription(offer);
                  console.log('Sending offer:', offer);
                  channelRef.current?.send({
                    type: 'broadcast',
                    event: 'offer',
                    payload: { offer },
                  });
                } catch (error) {
                  console.error('Error creating offer:', error);
                }
              }, 2000); // Increased delay to 2 seconds
            }
          });
      } catch (error) {
        console.error('Error setting up WebRTC:', error);
        setIsConnecting(false);
      }
    };

    setupWebRTC();

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  }, [roomId, isInitiator]);

  const toggleVideo = useCallback(() => {
    if (localStreamRef.current) {
      const videoTrack = localStreamRef.current.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        return videoTrack.enabled;
      }
    }
    return false;
  }, []);

  const hideVideoFromPartner = useCallback(() => {
    if (!peerConnection.current || !localStreamRef.current) return false;

    const videoTrack = localStreamRef.current.getVideoTracks()[0];
    if (!videoTrack) return false;

    if (isVideoHiddenFromPartner) {
      // Show video to partner: add the track back
      if (videoSenderRef.current) {
        // Track is already added, just update state
        setIsVideoHiddenFromPartner(false);
        return false;
      } else {
        // Re-add the track
        const sender = peerConnection.current.addTrack(videoTrack, localStreamRef.current);
        videoSenderRef.current = sender;
        setIsVideoHiddenFromPartner(false);
        return false;
      }
    } else {
      // Hide video from partner: remove the track
      if (videoSenderRef.current) {
        peerConnection.current.removeTrack(videoSenderRef.current);
        videoSenderRef.current = null;
        setIsVideoHiddenFromPartner(true);
        return true;
      }
    }
    return isVideoHiddenFromPartner;
  }, [isVideoHiddenFromPartner]);

  const toggleAudio = useCallback(() => {
    if (localStreamRef.current) {
      const audioTrack = localStreamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        return audioTrack.enabled;
      }
    }
    return false;
  }, []);

  const reconnect = useCallback(async () => {
    if (peerConnection.current) {
      peerConnection.current.close();
      peerConnection.current = null;
    }
    setRemoteStream(null);
    setConnectionState('disconnected');
    setIsConnecting(true);

    // Reinitialize after a short delay
    setTimeout(() => {
      if (roomId && localStream) {
        // Trigger the WebRTC setup effect again
        const event = new CustomEvent('reconnect');
        window.dispatchEvent(event);
      }
    }, 1000);
  }, [roomId, localStream]);

  return {
    localStream,
    remoteStream,
    connectionState,
    isConnecting,
    isVideoHiddenFromPartner,
    toggleVideo,
    toggleAudio,
    hideVideoFromPartner,
    reconnect,
    cleanup,
  };
};
