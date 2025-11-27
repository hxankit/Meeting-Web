/**
 * WebRTC utility functions
 * Handles peer connection setup, media streams, and screen sharing
 */

import { DEFAULT_WEBRTC_CONFIG } from "../types/index";

/**
 * Get user media (camera and microphone)
 * Provides better error messages for common issues
 */
export async function getUserMedia(
  constraints: MediaStreamConstraints = {
    video: true,
    audio: true,
  }
): Promise<MediaStream> {
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    throw new Error(
      "Your browser doesn't support camera/microphone access. Please use a modern browser like Chrome, Firefox, or Edge."
    );
  }

  try {
    const stream = await navigator.mediaDevices.getUserMedia(constraints);
    return stream;
  } catch (error: unknown) {
    console.error("Error getting user media:", error);
    
    if (error instanceof DOMException) {
      switch (error.name) {
        case "NotAllowedError":
        case "PermissionDeniedError":
          throw new Error(
            "Camera/microphone access denied. Please allow access in your browser settings and refresh the page."
          );
        case "NotFoundError":
        case "DevicesNotFoundError":
          throw new Error(
            "No camera or microphone found. Please connect a camera/microphone and try again."
          );
        case "NotReadableError":
        case "TrackStartError":
          throw new Error(
            "Camera/microphone is already in use by another application. Please close other applications using your camera/microphone."
          );
        case "OverconstrainedError":
          throw new Error(
            "Camera/microphone doesn't support the requested settings. Trying with basic settings..."
          );
        case "AbortError":
          throw new Error(
            "Camera/microphone access was interrupted. Please try again."
          );
        default:
          throw new Error(
            `Camera/microphone error: ${error.message || "Unknown error"}. Please check your device permissions.`
          );
      }
    }
    
    throw error instanceof Error 
      ? error 
      : new Error("Failed to access camera/microphone. Please check your browser permissions.");
  }
}

/**
 * Get display media (screen sharing)
 */
export async function getDisplayMedia(): Promise<MediaStream> {
  try {
    const stream = await navigator.mediaDevices.getDisplayMedia({
      video: true,
      audio: true, 
    });
    return stream;
  } catch (error) {
    console.error("Error getting display media:", error);
    throw error;
  }
}

/**
 * Create a new RTCPeerConnection with default configuration
 */
export function createPeerConnection(): RTCPeerConnection {
  return new RTCPeerConnection(DEFAULT_WEBRTC_CONFIG);
}

/**
 * Add tracks from a media stream to a peer connection
 */
export function addTracksToPeerConnection(
  peerConnection: RTCPeerConnection,
  stream: MediaStream
): void {
  stream.getTracks().forEach((track) => {
    peerConnection.addTrack(track, stream);
  });
}

/**
 * Replace tracks in a peer connection
 * Used when switching between camera and screen share
 */
export function replaceTracksInPeerConnection(
  peerConnection: RTCPeerConnection,
  stream: MediaStream
): void {
  const senders = peerConnection.getSenders();
  const tracks = stream.getTracks();

  // Replace video track if it exists
  const videoTrack = tracks.find((track) => track.kind === "video");
  if (videoTrack) {
    const videoSender = senders.find(
      (sender) => sender.track?.kind === "video"
    );
    if (videoSender) {
      videoSender.replaceTrack(videoTrack);
    } else {
      peerConnection.addTrack(videoTrack, stream);
    }
  }

  // Replace audio track if it exists
  const audioTrack = tracks.find((track) => track.kind === "audio");
  if (audioTrack) {
    const audioSender = senders.find(
      (sender) => sender.track?.kind === "audio"
    );
    if (audioSender) {
      audioSender.replaceTrack(audioTrack);
    } else {
      peerConnection.addTrack(audioTrack, stream);
    }
  }
}

/**
 * Stop all tracks in a media stream
 */
export function stopMediaStream(stream: MediaStream | null): void {
  if (stream) {
    stream.getTracks().forEach((track) => {
      track.stop();
    });
  }
}

/**
 * Update video track enabled state in peer connections
 * This ensures that when video is toggled off, audio continues to work
 */
export function updateVideoTrackState(
  peerConnection: RTCPeerConnection,
  enabled: boolean
): void {
  const senders = peerConnection.getSenders();
  const videoSender = senders.find(
    (sender) => sender.track?.kind === "video"
  );
  
  if (videoSender && videoSender.track) {
    videoSender.track.enabled = enabled;
  }
}

/**
 * Update audio track enabled state in peer connections
 */
export function updateAudioTrackState(
  peerConnection: RTCPeerConnection,
  enabled: boolean
): void {
  const senders = peerConnection.getSenders();
  const audioSender = senders.find(
    (sender) => sender.track?.kind === "audio"
  );
  
  if (audioSender && audioSender.track) {
    audioSender.track.enabled = enabled;
  }
}