/**
 * Custom hook for managing WebRTC peer connections
 * Handles offer/answer/ICE candidate exchange via Socket.io
 */

import { useEffect, useRef, useState, useCallback } from "react";
import { Socket } from "socket.io-client";
import {
  createPeerConnection,
  addTracksToPeerConnection,
  replaceTracksInPeerConnection,
  stopMediaStream,
} from "../utils/webrtc";
import { Participant, ConnectionStatus } from "../types";

interface UseWebRTCOptions {
  socket: Socket | null;
  localStream: MediaStream | null;
  roomId: string | null;
  currentUserId: string | null;
}

interface UseWebRTCReturn {
  remoteParticipants: Map<string, Participant>;
  connectionStatus: ConnectionStatus;
  peerConnections: Map<string, RTCPeerConnection>;
}

/**
 * WebRTC hook that manages peer connections for all participants
 * 
 * Signaling flow:
 * 1. When a new user joins, existing users create an offer
 * 2. New user receives offer, creates answer
 * 3. Both sides exchange ICE candidates
 * 4. Connection established, media streams flow
 */
export function useWebRTC({
  socket,
  localStream,
  roomId,
  currentUserId,
}: UseWebRTCOptions): UseWebRTCReturn {
  const [remoteParticipants, setRemoteParticipants] = useState<
    Map<string, Participant>
  >(new Map());
  const [connectionStatus, setConnectionStatus] =
    useState<ConnectionStatus>("idle");
  const peerConnectionsRef = useRef<Map<string, RTCPeerConnection>>(new Map());

  /**
   * Create a peer connection for a remote participant
   */
  const createPeerConnectionForUser = useCallback(
    (socketId: string): RTCPeerConnection => {
      const peerConnection = createPeerConnection();

      // Add local tracks if available
      if (localStream) {
        addTracksToPeerConnection(peerConnection, localStream);
      }

      // Handle remote stream
      peerConnection.ontrack = (event) => {
        const [remoteStream] = event.streams;
        setRemoteParticipants((prev) => {
          const updated = new Map(prev);
          const participant = updated.get(socketId) || {
            id: socketId,
          };
          participant.stream = remoteStream;
          updated.set(socketId, participant);
          return updated;
        });
      };

      // Handle ICE candidates
      peerConnection.onicecandidate = (event) => {
        if (event.candidate && socket) {
          socket.emit("ice-candidate", {
            candidate: event.candidate.toJSON(),
            targetSocketId: socketId,
            senderSocketId: currentUserId || "",
          });
        }
      };

      // Handle connection state changes
      peerConnection.onconnectionstatechange = () => {
        const state = peerConnection.connectionState;
        console.log(`Connection state with ${socketId}: ${state}`);
        
        if (state === "connected") {
          setConnectionStatus("connected");
        } else if (state === "disconnected" || state === "failed") {
          setConnectionStatus("disconnected");
        } else if (state === "connecting") {
          setConnectionStatus("connecting");
        }
      };

      return peerConnection;
    },
    [localStream, socket, currentUserId]
  );

  /**
   * Handle incoming offer from another peer
   */
  const handleOffer = useCallback(
    async (data: { offer: RTCSessionDescriptionInit; senderSocketId: string }) => {
      const { offer, senderSocketId } = data;
      
      if (!socket || !currentUserId) return;

      let peerConnection = peerConnectionsRef.current.get(senderSocketId);
      
      if (!peerConnection) {
        peerConnection = createPeerConnectionForUser(senderSocketId);
        peerConnectionsRef.current.set(senderSocketId, peerConnection);
      }

      try {
        await peerConnection.setRemoteDescription(
          new RTCSessionDescription(offer)
        );
        const answer = await peerConnection.createAnswer();
        await peerConnection.setLocalDescription(answer);

        socket.emit("answer", {
          answer: answer.toJSON(),
          targetSocketId: senderSocketId,
          senderSocketId: currentUserId,
        });
      } catch (error) {
        console.error("Error handling offer:", error);
      }
    },
    [socket, currentUserId, createPeerConnectionForUser]
  );

  /**
   * Handle incoming answer from another peer
   */
  const handleAnswer = useCallback(
    async (data: {
      answer: RTCSessionDescriptionInit;
      senderSocketId: string;
    }) => {
      const { answer, senderSocketId } = data;
      const peerConnection = peerConnectionsRef.current.get(senderSocketId);

      if (!peerConnection) {
        console.error("No peer connection found for", senderSocketId);
        return;
      }

      try {
        await peerConnection.setRemoteDescription(
          new RTCSessionDescription(answer)
        );
      } catch (error) {
        console.error("Error handling answer:", error);
      }
    },
    []
  );

  /**
   * Handle incoming ICE candidate
   */
  const handleIceCandidate = useCallback(
    (data: {
      candidate: RTCIceCandidateInit;
      senderSocketId: string;
    }) => {
      const { candidate, senderSocketId } = data;
      const peerConnection = peerConnectionsRef.current.get(senderSocketId);

      if (!peerConnection) {
        console.error("No peer connection found for", senderSocketId);
        return;
      }

      try {
        peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
      } catch (error) {
        console.error("Error adding ICE candidate:", error);
      }
    },
    []
  );

  /**
   * Create offer for a new participant
   */
  const createOfferForUser = useCallback(
    async (socketId: string) => {
      if (!socket || !currentUserId || !localStream) return;

      let peerConnection = peerConnectionsRef.current.get(socketId);
      
      if (!peerConnection) {
        peerConnection = createPeerConnectionForUser(socketId);
        peerConnectionsRef.current.set(socketId, peerConnection);
      }

      try {
        const offer = await peerConnection.createOffer();
        await peerConnection.setLocalDescription(offer);

        socket.emit("offer", {
          offer: offer.toJSON(),
          targetSocketId: socketId,
          senderSocketId: currentUserId,
        });
      } catch (error) {
        console.error("Error creating offer:", error);
      }
    },
    [socket, currentUserId, localStream, createPeerConnectionForUser]
  );

  /**
   * Handle user joined - create offer for new participant
   */
  const handleUserJoined = useCallback(
    (data: { participant: Participant }) => {
      const { participant } = data;
      
      setRemoteParticipants((prev) => {
        const updated = new Map(prev);
        updated.set(participant.id, participant);
        return updated;
      });

      // Create offer for the new participant
      createOfferForUser(participant.id);
    },
    [createOfferForUser]
  );

  /**
   * Handle user left - cleanup
   */
  const handleUserLeft = useCallback((data: { socketId: string }) => {
    const { socketId } = data;
    
    const peerConnection = peerConnectionsRef.current.get(socketId);
    if (peerConnection) {
      peerConnection.close();
      peerConnectionsRef.current.delete(socketId);
    }

    setRemoteParticipants((prev) => {
      const updated = new Map(prev);
      const participant = updated.get(socketId);
      if (participant?.stream) {
        stopMediaStream(participant.stream);
      }
      updated.delete(socketId);
      return updated;
    });
  }, []);

  /**
   * Handle screen share status update
   */
  const handleScreenShareStatus = useCallback(
    (data: { socketId: string; isSharing: boolean }) => {
      const { socketId, isSharing } = data;
      
      setRemoteParticipants((prev) => {
        const updated = new Map(prev);
        const participant = updated.get(socketId);
        if (participant) {
          participant.isScreenSharing = isSharing;
          updated.set(socketId, participant);
        }
        return updated;
      });
    },
    []
  );

  /**
   * Update local stream in all peer connections
   * Called when switching between camera and screen share
   */
  const updateLocalStreamInPeerConnections = useCallback(() => {
    if (!localStream) return;

    peerConnectionsRef.current.forEach((peerConnection) => {
      replaceTracksInPeerConnection(peerConnection, localStream);
    });
  }, [localStream]);

  // Update peer connections when local stream changes
  useEffect(() => {
    updateLocalStreamInPeerConnections();
  }, [updateLocalStreamInPeerConnections]);

  // Socket event listeners
  useEffect(() => {
    if (!socket) return;

    socket.on("offer", handleOffer);
    socket.on("answer", handleAnswer);
    socket.on("ice-candidate", handleIceCandidate);
    socket.on("user-joined", handleUserJoined);
    socket.on("user-left", handleUserLeft);
    socket.on("screen-share-status", handleScreenShareStatus);

    // Handle room-joined event - create offers for existing participants
    socket.on("room-joined", (data: { participants: Participant[] }) => {
      setConnectionStatus("connecting");
      data.participants.forEach((participant) => {
        setRemoteParticipants((prev) => {
          const updated = new Map(prev);
          updated.set(participant.id, participant);
          return updated;
        });
        createOfferForUser(participant.id);
      });
    });

    return () => {
      socket.off("offer", handleOffer);
      socket.off("answer", handleAnswer);
      socket.off("ice-candidate", handleIceCandidate);
      socket.off("user-joined", handleUserJoined);
      socket.off("user-left", handleUserLeft);
      socket.off("screen-share-status", handleScreenShareStatus);
      socket.off("room-joined");
    };
  }, [
    socket,
    handleOffer,
    handleAnswer,
    handleIceCandidate,
    handleUserJoined,
    handleUserLeft,
    handleScreenShareStatus,
    createOfferForUser,
  ]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      peerConnectionsRef.current.forEach((peerConnection) => {
        peerConnection.close();
      });
      peerConnectionsRef.current.clear();
      
      remoteParticipants.forEach((participant) => {
        if (participant.stream) {
          stopMediaStream(participant.stream);
        }
      });
    };
  }, []);

  return {
    remoteParticipants,
    connectionStatus,
    peerConnections: peerConnectionsRef.current,
  };
}

