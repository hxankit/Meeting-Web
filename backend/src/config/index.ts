/**
 * Configuration for the backend server
 */

export const config = {
  port: process.env.PORT || 3001,
  corsOrigin: process.env.CORS_ORIGIN || "http://localhost:5173", // Vite default port
};

