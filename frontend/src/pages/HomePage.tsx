/**
 * HomePage component
 * Allows users to create a new room or join an existing room
 */

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createRoom, getRoomInfo } from "../services/api";

export function HomePage() {
  const [roomId, setRoomId] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [isJoining, setIsJoining] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  /**
   * Create a new meeting room
   */
  const handleCreateRoom = async () => {
    setIsCreating(true);
    setError(null);

    try {
      const data = await createRoom();
      navigate(`/room/${data.roomId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create room");
    } finally {
      setIsCreating(false);
    }
  };

  /**
   * Join an existing room by ID
   */
  const handleJoinRoom = async () => {
    if (!roomId.trim()) {
      setError("Please enter a room ID");
      return;
    }

    setIsJoining(true);
    setError(null);

    try {
      const data = await getRoomInfo(roomId.trim().toUpperCase());
      if (data.exists) {
        navigate(`/room/${data.roomId}`);
      } else {
        setError("Room not found");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to join room");
    } finally {
      setIsJoining(false);
    }
  };

  return (
    <div className="home-page">
      <div className="container">
        <h1>Video Meeting App</h1>
        <p className="subtitle">Create or join a meeting room</p>

        <div className="actions">
          <div className="action-card">
            <h2>Create New Room</h2>
            <p>Start a new meeting room</p>
            <button
              onClick={handleCreateRoom}
              disabled={isCreating}
              className="btn btn-primary"
            >
              {isCreating ? "Creating..." : "Create Room"}
            </button>
          </div>

          <div className="divider">OR</div>

          <div className="action-card">
            <h2>Join Existing Room</h2>
            <p>Enter a room ID to join</p>
            <div className="join-form">
              <input
                type="text"
                placeholder="Enter Room ID"
                value={roomId}
                onChange={(e) => setRoomId(e.target.value.toUpperCase())}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    handleJoinRoom();
                  }
                }}
                className="input"
                maxLength={6}
              />
              <button
                onClick={handleJoinRoom}
                disabled={isJoining || !roomId.trim()}
                className="btn btn-secondary"
              >
                {isJoining ? "Joining..." : "Join Room"}
              </button>
            </div>
          </div>
        </div>

        {error && <div className="error-message">{error}</div>}
      </div>
    </div>
  );
}

