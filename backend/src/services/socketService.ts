/**
 * Socket service - Handles Socket.io events for WebRTC signaling
 */

import { Server, Socket } from "socket.io";
import {
  OfferPayload,
  AnswerPayload,
  IceCandidatePayload,
  JoinRoomPayload,
  Participant,
} from "../types";
import { RoomService } from "./roomService";

export class SocketService {
  constructor(
    private io: Server,
    private roomService: RoomService
  ) {}

  /**
   * Initialize socket connection handlers
   */
  initialize(): void {
    this.io.on("connection", (socket: Socket) => {
      console.log(`Client connected: ${socket.id}`);

      // Handle joining a room
      socket.on("join-room", (payload: JoinRoomPayload) =>
        this.handleJoinRoom(socket, payload)
      );

      // Handle WebRTC offer
      socket.on("offer", (payload: OfferPayload) =>
        this.handleOffer(socket, payload)
      );

      // Handle WebRTC answer
      socket.on("answer", (payload: AnswerPayload) =>
        this.handleAnswer(socket, payload)
      );

      // Handle ICE candidates
      socket.on("ice-candidate", (payload: IceCandidatePayload) =>
        this.handleIceCandidate(socket, payload)
      );

      // Handle screen sharing status update
      socket.on("screen-share-status", (payload: {
        roomId: string;
        isSharing: boolean;
      }) => this.handleScreenShareStatus(socket, payload));

      // Handle disconnection
      socket.on("disconnect", () => this.handleDisconnect(socket));
    });
  }

  /**
   * Handle joining a room
   * When a user joins, we:
   * 1. Add them to the room
   * 2. Notify other participants
   * 3. Send them the list of existing participants
   */
  private handleJoinRoom(socket: Socket, payload: JoinRoomPayload): void {
    const { roomId, name } = payload;
    
    if (!this.roomService.roomExists(roomId)) {
      socket.emit("error", { message: "Room does not exist" });
      return;
    }

    // Join the socket room (for broadcasting)
    socket.join(roomId);

    // Create participant
    const participant: Participant = {
      id: socket.id,
      name: name || `User ${socket.id.substring(0, 6)}`,
      isScreenSharing: false,
    };

    // Add to room
    this.roomService.addParticipant(roomId, participant);

    // Get other participants in the room
    const otherParticipants = this.roomService.getOtherParticipants(
      roomId,
      socket.id
    );

    // Notify the new user about existing participants
    socket.emit("room-joined", {
      roomId,
      participants: otherParticipants.map((p) => ({
        id: p.id,
        name: p.name,
        isScreenSharing: p.isScreenSharing,
      })),
    });

    // Notify other participants about the new user
    socket.to(roomId).emit("user-joined", {
      participant: {
        id: participant.id,
        name: participant.name,
        isScreenSharing: participant.isScreenSharing,
      },
    });

    console.log(
      `User ${socket.id} joined room ${roomId}. Total participants: ${
        otherParticipants.length + 1
      }`
    );
  }

  /**
   * Handle WebRTC offer
   * When a peer wants to initiate a connection, they send an offer
   */
  private handleOffer(socket: Socket, payload: OfferPayload): void {
    const { offer, targetSocketId } = payload;
    console.log(`Offer from ${socket.id} to ${targetSocketId}`);
    
    // Forward the offer to the target peer
    this.io.to(targetSocketId).emit("offer", {
      offer,
      senderSocketId: socket.id,
    });
  }

  /**
   * Handle WebRTC answer
   * When a peer receives an offer, they respond with an answer
   */
  private handleAnswer(socket: Socket, payload: AnswerPayload): void {
    const { answer, targetSocketId } = payload;
    console.log(`Answer from ${socket.id} to ${targetSocketId}`);
    
    // Forward the answer to the target peer
    this.io.to(targetSocketId).emit("answer", {
      answer,
      senderSocketId: socket.id,
    });
  }

  /**
   * Handle ICE candidates
   * ICE candidates are exchanged to establish the connection
   */
  private handleIceCandidate(socket: Socket, payload: IceCandidatePayload): void {
    const { candidate, targetSocketId } = payload;
    
    // Forward the ICE candidate to the target peer
    this.io.to(targetSocketId).emit("ice-candidate", {
      candidate,
      senderSocketId: socket.id,
    });
  }

  /**
   * Handle screen sharing status update
   */
  private handleScreenShareStatus(
    socket: Socket,
    payload: { roomId: string; isSharing: boolean }
  ): void {
    const { roomId, isSharing } = payload;
    this.roomService.updateScreenShareStatus(roomId, socket.id, isSharing);
    
    // Notify other participants
    socket.to(roomId).emit("screen-share-status", {
      socketId: socket.id,
      isSharing,
    });
  }

  /**
   * Handle disconnection
   */
  private handleDisconnect(socket: Socket): void {
    console.log(`Client disconnected: ${socket.id}`);
    
    // Find and remove the participant from their room
    const roomId = this.roomService.removeParticipant(socket.id);
    
    if (roomId) {
      // Notify other participants
      this.io.to(roomId).emit("user-left", {
        socketId: socket.id,
      });
    }
  }
}

