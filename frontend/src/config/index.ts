/**
 * Frontend configuration
 */

export const config = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || "http://localhost:3001",
  socketUrl: import.meta.env.VITE_SOCKET_URL || "http://localhost:3001",
};

