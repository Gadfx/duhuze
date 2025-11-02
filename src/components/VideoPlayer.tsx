import { forwardRef } from "react";
import { cn } from "@/lib/utils";

interface VideoPlayerProps extends React.VideoHTMLAttributes<HTMLVideoElement> {
  onElement?: (element: HTMLVideoElement | null) => void;
}

const VideoPlayer = forwardRef<HTMLVideoElement, VideoPlayerProps>(
  ({ className, onElement, ...props }, ref) => {
    return (
      <video
        ref={(element) => {
          if (typeof ref === "function") {
            ref(element);
          } else if (ref) {
            ref.current = element;
          }
          onElement?.(element);
        }}
        autoPlay
        playsInline
        className={cn("bg-black", className)}
        {...props}
      />
    );
  }
);

VideoPlayer.displayName = "VideoPlayer";

export default VideoPlayer;
