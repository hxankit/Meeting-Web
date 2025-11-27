/**
 * API service - Handles REST API calls to the backend
 */

import { config } from "../config";

export interface CreateRoomResponse {
  roomId: string;
  createdAt: Date;
}

export interface RoomInfoResponse {
  exists: boolean;
  roomId: string;
  participantCount?: number;
}

/**
 * Create a new meeting room
 */
export async function createRoom(): Promise<CreateRoomResponse> {
  const response = await fetch(`${config.apiBaseUrl}/api/rooms`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to create room: ${errorText || response.statusText}`);
  }

  return response.json();
}

/**
 * Get room information by room ID
 */
export async function getRoomInfo(roomId: string): Promise<RoomInfoResponse> {
  const response = await fetch(`${config.apiBaseUrl}/api/rooms/${roomId}`);

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error("Room not found");
    }
    const errorText = await response.text();
    throw new Error(`Failed to get room info: ${errorText || response.statusText}`);
  }

  return response.json();
}

