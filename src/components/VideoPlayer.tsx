import { useEffect, useRef } from 'react';

interface VideoPlayerProps {
  stream: MediaStream | null;
  muted?: boolean;
  className?: string;
}

const VideoPlayer = ({ stream, muted = false, className = '' }: VideoPlayerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      if (stream) {
        console.log('Setting video srcObject:', stream);
        console.log('Stream tracks:', stream.getTracks());
        videoRef.current.srcObject = stream;
        videoRef.current.play().catch(error => {
          console.error('Error playing video:', error);
        });
      } else {
        console.log('Clearing video srcObject');
        videoRef.current.srcObject = null;
      }
    }
  }, [stream]);

  return (
    <video
      ref={videoRef}
      autoPlay
      playsInline
      muted={muted}
      className={`w-full h-full object-cover ${className}`}
      onLoadedData={() => console.log('Video loaded data')}
      onError={(e) => console.error('Video error:', e)}
    />
  );
};

export default VideoPlayer;
