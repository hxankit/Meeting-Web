/**
 * Room service - In-memory room management
 * Tracks rooms and their participants
 */

import { Room, Participant } from "../types";

export class RoomService {
  private rooms: Map<string, Room> = new Map();

  /**
   * Create a new room
   */
  createRoom(): Room {
    const roomId = this.generateRoomId();
    const room: Room = {
      id: roomId,
      createdAt: new Date(),
      participants: new Map(),
    };
    this.rooms.set(roomId, room);
    return room;
  }

  /**
   * Get a room by ID
   */
  getRoom(roomId: string): Room | undefined {
    return this.rooms.get(roomId);
  }

  /**
   * Check if a room exists
   */
  roomExists(roomId: string): boolean {
    return this.rooms.has(roomId);
  }

  /**
   * Add a participant to a room
   */
  addParticipant(roomId: string, participant: Participant): boolean {
    const room = this.rooms.get(roomId);
    if (!room) {
      return false;
    }
    room.participants.set(participant.id, participant);
    return true;
  }

  /**
   * Remove a participant from a room
   * If roomId is provided, only checks that room. Otherwise searches all rooms.
   */
  removeParticipant(socketId: string, roomId?: string): string | null {
    if (roomId) {
      // Remove from specific room
      const room = this.rooms.get(roomId);
      if (room && room.participants.has(socketId)) {
        room.participants.delete(socketId);
        
        // Clean up empty rooms (optional - you might want to keep them for a while)
        if (room.participants.size === 0) {
          this.rooms.delete(roomId);
        }
        
        return roomId;
      }
      return null;
    } else {
      // Search all rooms for the socket
      for (const [roomId, room] of this.rooms.entries()) {
        if (room.participants.has(socketId)) {
          room.participants.delete(socketId);
          
          // Clean up empty rooms (optional - you might want to keep them for a while)
          if (room.participants.size === 0) {
            this.rooms.delete(roomId);
          }
          
          return roomId;
        }
      }
      return null;
    }
  }

  /**
   * Get all participants in a room (excluding the specified socket ID)
   */
  getOtherParticipants(roomId: string, excludeSocketId: string): Participant[] {
    const room = this.rooms.get(roomId);
    if (!room) {
      return [];
    }
    return Array.from(room.participants.values()).filter(
      (p: Participant) => p.id !== excludeSocketId
    );
  }

  /**
   * Update participant's screen sharing status
   */
  updateScreenShareStatus(
    roomId: string,
    socketId: string,
    isScreenSharing: boolean
  ): boolean {
    const room = this.rooms.get(roomId);
    if (!room) {
      return false;
    }
    const participant = room.participants.get(socketId);
    if (participant) {
      participant.isScreenSharing = isScreenSharing;
      return true;
    }
    return false;
  }

  /**
   * Generate a random room ID (6 characters)
   */
  private generateRoomId(): string {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  }
}

