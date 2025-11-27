/**
 * Type definitions for the meeting application frontend
 */

export interface Participant {
  id: string; // Socket ID
  name?: string;
  isScreenSharing?: boolean;
  stream?: MediaStream;
}

export interface Room {
  id: string;
  createdAt?: Date;
}

export type ConnectionStatus = "idle" | "connecting" | "connected" | "disconnected";

export interface WebRTCConfig {
  iceServers: RTCIceServer[];
}

// Default STUN servers for WebRTC
export const DEFAULT_WEBRTC_CONFIG: WebRTCConfig = {
  iceServers: [
    { urls: "stun:stun.l.google.com:19302" },
    { urls: "stun:stun1.l.google.com:19302" },
  ],
};
