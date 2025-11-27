/**
 * MeetingRoom component
 * Main component for the video meeting interface
 * Handles local/remote video streams, controls, and screen sharing
 */

import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSocket } from "../hooks/useSocket";
import { useWebRTC } from "../hooks/useWebRTC";
import {
  getUserMedia,
  getDisplayMedia,
  stopMediaStream,
  updateVideoTrackState,
  updateAudioTrackState,
} from "../utils/webrtc";
import { VideoPlayer } from "../components/VideoPlayer";
import { MeetingControls } from "../components/MeetingControls";

export function MeetingRoom() {
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();
  
  const socket = useSocket();
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [screenShareStream, setScreenShareStream] = useState<MediaStream | null>(null);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [localStreamError, setLocalStreamError] = useState<string | null>(null);
  
  const screenShareEndedHandlerRef = useRef<(() => void) | null>(null);

  // WebRTC hook
  const { remoteParticipants, connectionStatus, peerConnections } = useWebRTC({
    socket,
    localStream: isScreenSharing ? screenShareStream : localStream,
    roomId: roomId || null,
    currentUserId: socket?.id || null,
  });

  /**
   * Initialize local media stream (camera and microphone)
   * Tries with video+audio first, then falls back to audio-only if video fails
   */
  useEffect(() => {
    let stream: MediaStream | null = null;

    const initLocalStream = async () => {
      // Check if permissions API is available (optional check)
      if (navigator.permissions) {
        try {
          const cameraPermission = await navigator.permissions.query({ name: "camera" as PermissionName });
          const microphonePermission = await navigator.permissions.query({ name: "microphone" as PermissionName });
          
          console.log("Camera permission:", cameraPermission.state);
          console.log("Microphone permission:", microphonePermission.state);
          
          if (cameraPermission.state === "denied" && microphonePermission.state === "denied") {
            setLocalStreamError(
              "Camera and microphone access are blocked. Please enable them in your browser settings (usually in the address bar or browser settings) and refresh the page."
            );
            return;
          }
        } catch (permError) {
          // Permissions API might not be fully supported, continue anyway
          console.log("Permissions API not fully supported, continuing...");
        }
      }

      try {
        // Try to get both video and audio first with better constraints
        const mediaStream = await getUserMedia({
          video: {
            width: { ideal: 1280 },
            height: { ideal: 720 },
            facingMode: "user",
          },
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
          },
        });
        stream = mediaStream;
        setLocalStream(mediaStream);
        setLocalStreamError(null);
        console.log("Local stream initialized:", mediaStream.id);
      } catch (error) {
        console.error("Error accessing media devices:", error);
        const errorMessage = error instanceof Error ? error.message : "Failed to access camera/microphone";
        
        // If video fails, try audio-only as fallback
        const errorLower = errorMessage.toLowerCase();
        if (errorLower.includes("video") || 
            errorLower.includes("camera") ||
            errorLower.includes("videoinput")) {
          try {
            console.log("Video failed, trying audio-only...");
            const audioStream = await getUserMedia({
              video: false,
              audio: {
                echoCancellation: true,
                noiseSuppression: true,
              },
            });
            stream = audioStream;
            setLocalStream(audioStream);
            setLocalStreamError(
              "Camera access failed, but microphone is working. You can still participate with audio."
            );
            console.log("Audio-only stream initialized:", audioStream.id);
          } catch (audioError) {
            // Both failed - allow user to join without media
            console.error("Audio-only also failed:", audioError);
            setLocalStreamError(
              errorMessage + " You can still join the meeting, but others won't see or hear you."
            );
          }
        } else {
          // Audio failed or other error
          setLocalStreamError(errorMessage);
        }
      }
    };

    initLocalStream();

    return () => {
      if (stream) {
        console.log("Cleaning up local stream");
        stopMediaStream(stream);
      }
    };
  }, []);

  /**
   * Join room when socket is connected
   */
  useEffect(() => {
    if (socket && roomId && socket.id) {
      socket.emit("join-room", {
        roomId,
        name: `User ${socket.id.substring(0, 6)}`,
      });
    }
  }, [socket, roomId]);

  /**
   * Handle screen sharing
   * When starting: get display media and replace video track
   * When stopping: revert to camera stream
   */
  const handleScreenShare = async () => {
    if (isScreenSharing) {
      // Stop screen sharing
      if (screenShareStream) {
        stopMediaStream(screenShareStream);
        setScreenShareStream(null);
      }
      setIsScreenSharing(false);
      
      // Notify other participants
      if (socket && roomId) {
        socket.emit("screen-share-status", {
          roomId,
          isSharing: false,
        });
      }
    } else {
      // Start screen sharing
      try {
        const stream = await getDisplayMedia();
        setScreenShareStream(stream);
        setIsScreenSharing(true);
        
        // Notify other participants
        if (socket && roomId) {
          socket.emit("screen-share-status", {
            roomId,
            isSharing: true,
          });
        }

        // Handle screen share ending (user clicks stop in browser UI)
        const handleScreenShareEnded = () => {
          stopMediaStream(stream);
          setScreenShareStream(null);
          setIsScreenSharing(false);
          
          if (socket && roomId) {
            socket.emit("screen-share-status", {
              roomId,
              isSharing: false,
            });
          }
        };

        // Listen for track ended event (when user stops sharing via browser)
        stream.getVideoTracks()[0].addEventListener("ended", handleScreenShareEnded);
        screenShareEndedHandlerRef.current = handleScreenShareEnded;
      } catch (error) {
        console.error("Error starting screen share:", error);
        // User likely cancelled the screen share dialog
      }
    }
  };

  /**
   * Toggle microphone mute/unmute
   */
  const handleToggleMute = () => {
    if (!localStream) return;

    const audioTracks = localStream.getAudioTracks();
    const newMuteState = !isMuted;

    audioTracks.forEach((track) => {
      track.enabled = newMuteState;
    });
    setIsMuted(newMuteState);
    
    // Update all peer connections
    peerConnections.forEach((peerConnection) => {
      updateAudioTrackState(peerConnection, newMuteState);
    });
  };

  /**
   * Toggle camera on/off
   * When camera is off, video track is disabled but audio continues to work
   */
  const handleToggleVideo = async () => {
    if (!localStream) return;

    const videoTracks = localStream.getVideoTracks();
    const audioTracks = localStream.getAudioTracks();
    const newVideoState = !isVideoOff;

    if (newVideoState) {
      // Turning camera ON
      videoTracks.forEach((track) => {
        track.enabled = true;
      });
      setIsVideoOff(false);
      
      // Update all peer connections
      peerConnections.forEach((peerConnection) => {
        updateVideoTrackState(peerConnection, true);
      });
    } else {
      // Turning camera OFF - disable video but keep audio enabled
      videoTracks.forEach((track) => {
        track.enabled = false;
      });
      // Ensure audio tracks remain enabled
      audioTracks.forEach((track) => {
        track.enabled = true;
      });
      setIsVideoOff(true);
      
      // Update all peer connections - disable video, keep audio enabled
      peerConnections.forEach((peerConnection) => {
        updateVideoTrackState(peerConnection, false);
        updateAudioTrackState(peerConnection, true);
      });
    }

    // Notify other participants about video state change
    if (socket && roomId) {
      socket.emit("video-state-change", {
        roomId,
        isVideoOff: !newVideoState,
      });
    }
  };

  /**
   * Leave the meeting room
   */
  const handleLeaveRoom = () => {
    // Stop all streams
    if (localStream) {
      stopMediaStream(localStream);
    }
    if (screenShareStream) {
      stopMediaStream(screenShareStream);
    }
    
    // Navigate back to home
    navigate("/");
  };

  // Get current display stream (screen share if active, otherwise camera)
  const currentDisplayStream = isScreenSharing
    ? screenShareStream
    : localStream;

  // Convert remote participants map to array
  const remoteParticipantsArray = Array.from(remoteParticipants.values());

  return (
    <div className="meeting-room">
      <div className="meeting-header">
        <div className="room-info">
          <h2>Room: {roomId}</h2>
          <span className={`status ${connectionStatus}`}>
            {connectionStatus}
          </span>
        </div>
        <div className="participant-count">
          {remoteParticipantsArray.length + 1} participant
          {remoteParticipantsArray.length !== 0 ? "s" : ""}
        </div>
      </div>

      {localStreamError && (
        <div className="error-banner">
          <strong>⚠️ Media Access Issue</strong>
          <br />
          {localStreamError}
          <br />
          <button
            onClick={() => window.location.reload()}
            className="retry-btn"
            style={{
              marginTop: "10px",
              padding: "8px 16px",
              background: "white",
              color: "#f44336",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontWeight: "600",
            }}
          >
            Refresh Page
          </button>
        </div>
      )}

      <div className="video-grid">
        {/* Local video */}
        <div className="video-container local">
          <VideoPlayer
            stream={currentDisplayStream}
            isMuted={isMuted}
            isVideoOff={isVideoOff}
            label="You"
            isScreenSharing={isScreenSharing}
            isLocal={true}
          />
        </div>

        {/* Remote participants */}
        {remoteParticipantsArray.map((participant) => (
          <div key={participant.id} className="video-container remote">
            <VideoPlayer
              stream={participant.stream}
              isMuted={false}
              isVideoOff={false}
              label={participant.name || participant.id.substring(0, 6)}
              isScreenSharing={participant.isScreenSharing}
            />
          </div>
        ))}
      </div>

      <MeetingControls
        isMuted={isMuted}
        isVideoOff={isVideoOff}
        isScreenSharing={isScreenSharing}
        onToggleMute={handleToggleMute}
        onToggleVideo={handleToggleVideo}
        onScreenShare={handleScreenShare}
        onLeave={handleLeaveRoom}
      />
    </div>
  );
}

