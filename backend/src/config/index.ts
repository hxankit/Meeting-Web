/**
 * Configuration for the backend server
 */

export const config = {
  port: parseInt(process.env.PORT || "3001", 10),
  corsOrigin: process.env.CORS_ORIGIN || "http://localhost:5173", // Vite default port
};

