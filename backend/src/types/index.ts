/**
 * Type definitions for backend
 */

export interface Participant {
  id: string;
  name: string;
  isScreenSharing: boolean;
  socketId?: string;
  userId?: string;
  joinedAt?: Date;
}

export interface Room {
  id: string;
  createdAt: Date;
  participants: Map<string, Participant>;
}

export interface JoinRoomPayload {
  roomId: string;
  userId: string;
  id: string;
  name: string;
}

export interface OfferPayload {
  offer: Record<string, unknown>;
  targetSocketId: string;
  senderSocketId: string;
}

export interface AnswerPayload {
  answer: Record<string, unknown>;
  targetSocketId: string;
  senderSocketId: string;
}

export interface IceCandidatePayload {
  candidate: Record<string, unknown>;
  targetSocketId: string;
  senderSocketId: string;
}
