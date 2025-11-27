

import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
import path from "path";
import { config } from "./config";
import { RoomService } from "./services/roomService";
import { SocketService } from "./services/socketService";
import roomRoutes from "./routes/roomRoutes";

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  // config.corsOrigin
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});
app.use(cors({ origin: config.corsOrigin }));
app.use(express.json());

// Serve static files from frontend build
const frontendPath = path.join(__dirname, "../../frontend/dist");
app.use(express.static(frontendPath));

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "ok", message: "Server is running" });
});

const roomService = new RoomService();
const socketService = new SocketService(io, roomService);

// Register routes
app.use("/api/rooms", roomRoutes);

socketService.initialize();

// Serve frontend index.html for all other routes (SPA routing)
app.get("*", (req, res) => {
  res.sendFile(path.join(frontendPath, "index.html"));
});

// Start server
httpServer.listen(config.port, () => {
  console.log(`✅ Server running on port ${config.port}`);
  console.log(`✅ CORS enabled for: ${config.corsOrigin}`);
  console.log(`✅ API endpoints available at: http://localhost:${config.port}/api/rooms`);
  console.log(`✅ Health check: http://localhost:${config.port}/health`);
  console.log(`✅ Frontend served at: http://localhost:${config.port}`);
});
