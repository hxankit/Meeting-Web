
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createServer } from "node:http";
import { Server } from "socket.io";
import mongoose from "mongoose";
import { connectToSocket } from "./controllers/socketManager.js";
import cors from "cors";
import userRoutes from "./routes/users.routes.js";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const server = createServer(app);
const io = connectToSocket(server);

const PORT = process.env.PORT || 8000;
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/";

app.set("port", PORT);
app.use(cors());
app.use(express.json({ limit: "40kb" }));
app.use(express.urlencoded({ limit: "40kb", extended: true }));


// Serve static frontend build (from CRA build folder)
const frontendBuildPath = path.join(__dirname, "../../frontend/build");
app.use(express.static(frontendBuildPath));

app.use("/api/v1/users", userRoutes);

// Fallback to index.html for SPA
app.get("*", (req, res) => {
    res.sendFile(path.join(frontendBuildPath, "index.html"));
});

let isServerStarted = false;
const start = async () => {
    try {
        const connectionDb = await mongoose.connect(MONGODB_URI);
        if (connectionDb && connectionDb.connection && connectionDb.connection.host) {
            console.log(`MONGO Connected DB Host: ${connectionDb.connection.host}`);
        } else {
            console.log("MONGO Connected, but host info unavailable");
        }
        if (!isServerStarted) {
            server.listen(PORT, () => {
                isServerStarted = true;
                console.log(`LISTENING ON PORT ${PORT}`);
            });
        } else {
            console.log("Server is already running, skipping listen()");
        }
    } catch (error) {
        console.error("Failed to connect to MongoDB:", error);
        process.exit(1);
    }
};

start();
start();