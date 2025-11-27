/**
 * VideoPlayer component
 * Displays a video stream with optional labels and indicators
 */

import { useEffect, useRef } from "react";

interface VideoPlayerProps {
  stream: MediaStream | null | undefined;
  isMuted: boolean;
  isVideoOff: boolean;
  label: string;
  isScreenSharing?: boolean;
  isLocal?: boolean; // Indicates if this is the local user's video
}

export function VideoPlayer({
  stream,
  isMuted,
  isVideoOff,
  label,
  isScreenSharing = false,
  isLocal = false,
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    if (stream) {
      console.log("Setting video stream:", {
        id: stream.id,
        active: stream.active,
        videoTracks: stream.getVideoTracks().length,
        audioTracks: stream.getAudioTracks().length,
      });

      // Check if stream has active and enabled video tracks
      const videoTracks = stream.getVideoTracks();
      const hasVideo = videoTracks.length > 0 && 
                       videoTracks[0].readyState === "live" && 
                       videoTracks[0].enabled;
      
      if (hasVideo && !isVideoOff) {
        videoElement.srcObject = stream;
        // Ensure video plays
        videoElement
          .play()
          .then(() => {
            console.log("Video playing successfully");
          })
          .catch((error) => {
            console.error("Error playing video:", error);
          });
      } else {
        // Audio-only stream or video disabled - still set it for audio playback
        console.log("Stream has no active video tracks or video is disabled (audio-only)");
        videoElement.srcObject = stream;
        // Try to play anyway (for audio)
        videoElement
          .play()
          .catch((error) => {
            console.error("Error playing audio stream:", error);
          });
      }
    } else {
      // Clear the video source when stream is null
      videoElement.srcObject = null;
    }

    // Cleanup: clear srcObject when component unmounts or stream changes
    return () => {
      if (videoElement) {
        videoElement.srcObject = null;
      }
    };
  }, [stream]);

  return (
    <div className="video-player">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted={isLocal || isMuted} // Local video should always be muted to prevent feedback
        className={isVideoOff ? "video-off" : ""}
      />
      {isVideoOff && (
        <div className="video-placeholder">
          <span className="video-off-icon">📷</span>
        </div>
      )}
      <div className="video-label">
        {label}
        {isScreenSharing && (
          <span className="screen-share-badge">🖥️ Sharing</span>
        )}
      </div>
      {isMuted && <div className="mute-indicator">🔇 Muted</div>}
    </div>
  );
}
