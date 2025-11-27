/**
 * Room controller - Handles REST API endpoints for rooms
 */

import { Request, Response } from "express";
import { RoomService } from "../services/roomService";

export class RoomController {
  constructor(private roomService: RoomService) {}

  /**
   * POST /api/rooms - Create a new meeting room
   */
  createRoom = (req: Request, res: Response): void => {
    try {
      console.log("📝 POST /api/rooms - Creating new room");
      const room = this.roomService.createRoom();
      console.log(`✅ Room created: ${room.id}`);
      res.json({
        roomId: room.id,
        createdAt: room.createdAt,
      });
    } catch (error) {
      console.error("❌ Error creating room:", error);
      res.status(500).json({ error: "Failed to create room" });
    }
  };

  /**
   * GET /api/rooms/:roomId - Check if a room exists
   */
  getRoom = (req: Request, res: Response): void => {
    const { roomId } = req.params;
    console.log(`📖 GET /api/rooms/${roomId} - Checking room existence`);
    const exists = this.roomService.roomExists(roomId);
    
    if (exists) {
      const room = this.roomService.getRoom(roomId);
      console.log(`✅ Room ${roomId} exists with ${room?.participants.size || 0} participants`);
      res.json({
        exists: true,
        roomId: roomId,
        participantCount: room?.participants.size || 0,
      });
    } else {
      console.log(`❌ Room ${roomId} not found`);
      res.status(404).json({
        exists: false,
        roomId: roomId,
      });
    }
  };
}

