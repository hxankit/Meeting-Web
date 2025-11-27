/**
 * Custom hook for managing Socket.io connection
 */

import { useEffect, useState } from "react";
import { Socket } from "socket.io-client";
import { getSocket, closeSocket } from "../services/socketService";

export function useSocket(): Socket | null {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const socketInstance = getSocket();
    setSocket(socketInstance);

    return () => {
      // Note: We don't close the socket here as it might be used by multiple components
      // The socket will be reused across the app
    };
  }, []);

  return socket;
}
