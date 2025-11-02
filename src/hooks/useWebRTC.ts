import { useState, useEffect, useRef } from "react";
import { Socket } from "socket.io-client";

export default function useWebRTC(socket: Socket | null) {
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const peerConnection = useRef<RTCPeerConnection | null>(null);

  useEffect(() => {
    if (!socket) return;

    socket.on("sdp:reply", async ({ sdp, from }: any) => {
      if (peerConnection.current) {
        await peerConnection.current.setRemoteDescription(new RTCSessionDescription(sdp));
        
        if (sdp.type === "offer") {
          const answer = await peerConnection.current.createAnswer();
          await peerConnection.current.setLocalDescription(answer);
          socket.emit("sdp:send", { sdp: answer });
        }
      }
    });

    socket.on("ice:reply", async ({ candidate }: any) => {
      if (peerConnection.current && candidate) {
        await peerConnection.current.addIceCandidate(new RTCIceCandidate(candidate));
      }
    });

    return () => {
      socket.off("sdp:reply");
      socket.off("ice:reply");
    };
  }, [socket]);

  const startCall = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      setLocalStream(stream);

      const pc = new RTCPeerConnection({
        iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
      });

      stream.getTracks().forEach((track) => {
        pc.addTrack(track, stream);
      });

      pc.ontrack = (event) => {
        setRemoteStream(event.streams[0]);
      };

      pc.onicecandidate = (event) => {
        if (event.candidate && socket) {
          socket.emit("ice:send", { candidate: event.candidate });
        }
      };

      peerConnection.current = pc;

      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);
      socket?.emit("sdp:send", { sdp: offer });
    } catch (error) {
      console.error("Error starting call:", error);
    }
  };

  const stopCall = () => {
    if (localStream) {
      localStream.getTracks().forEach((track) => track.stop());
    }
    if (peerConnection.current) {
      peerConnection.current.close();
    }
    setLocalStream(null);
    setRemoteStream(null);
  };

  const toggleVideo = () => {
    if (localStream) {
      const videoTrack = localStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
      }
    }
  };

  const toggleAudio = () => {
    if (localStream) {
      const audioTrack = localStream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
      }
    }
  };

  const hideVideoFromPartner = () => {
    if (localStream) {
      const videoTrack = localStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
      }
    }
  };

  return {
    localStream,
    remoteStream,
    startCall,
    stopCall,
    toggleVideo,
    toggleAudio,
    hideVideoFromPartner,
  };
}
