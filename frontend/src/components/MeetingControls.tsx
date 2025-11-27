/**
 * MeetingControls component
 * Control buttons for the meeting (mute, video, screen share, leave)
 */

interface MeetingControlsProps {
  isMuted: boolean;
  isVideoOff: boolean;
  isScreenSharing: boolean;
  onToggleMute: () => void;
  onToggleVideo: () => void;
  onScreenShare: () => void;
  onLeave: () => void;
}

export function MeetingControls({
  isMuted,
  isVideoOff,
  isScreenSharing,
  onToggleMute,
  onToggleVideo,
  onScreenShare,
  onLeave,
}: MeetingControlsProps) {
  return (
    <div className="meeting-controls">
      <button
        onClick={onToggleMute}
        className={`control-btn ${isMuted ? "active" : ""}`}
        title={isMuted ? "Unmute" : "Mute"}
      >
        {isMuted ? "🔇" : "🎤"}
        <span>{isMuted ? "Unmute" : "Mute"}</span>
      </button>

      <button
        onClick={onToggleVideo}
        className={`control-btn ${isVideoOff ? "active" : ""}`}
        title={isVideoOff ? "Turn on camera" : "Turn off camera"}
      >
        {isVideoOff ? "📷" : "📹"}
        <span>{isVideoOff ? "Camera On" : "Camera Off"}</span>
      </button>

      <button
        onClick={onScreenShare}
        className={`control-btn ${isScreenSharing ? "active" : ""}`}
        title={isScreenSharing ? "Stop sharing" : "Share screen"}
      >
        {isScreenSharing ? "🖥️" : "🖥️"}
        <span>{isScreenSharing ? "Stop Sharing" : "Share Screen"}</span>
      </button>

      <button
        onClick={onLeave}
        className="control-btn leave-btn"
        title="Leave meeting"
      >
        🚪
        <span>Leave</span>
      </button>
    </div>
  );
}
