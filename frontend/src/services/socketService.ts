/**
 * Socket service - Manages Socket.io connection
 */

import { io, Socket } from "socket.io-client";
import { config } from "../config";

let socketInstance: Socket | null = null;

/**
 * Get or create Socket.io connection instance
 */
export function getSocket(): Socket {
  if (!socketInstance) {
    socketInstance = io(config.socketUrl, {
      transports: ["websocket"],
    });

    socketInstance.on("connect", () => {
      console.log("Socket connected:", socketInstance?.id);
    });

    socketInstance.on("disconnect", () => {
      console.log("Socket disconnected");
    });

    socketInstance.on("error", (error: Error) => {
      console.error("Socket error:", error);
    });
  }

  return socketInstance;
}

/**
 * Close Socket.io connection
 */
export function closeSocket(): void {
  if (socketInstance) {
    socketInstance.close();
    socketInstance = null;
  }
}

