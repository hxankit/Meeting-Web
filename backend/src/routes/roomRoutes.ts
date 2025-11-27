/**
 * Room routes - Defines REST API routes for rooms
 */

import { Router } from "express";
import { RoomController } from "../controllers/roomController";
import { RoomService } from "../services/roomService";

const router = Router();
const roomService = new RoomService();
const roomController = new RoomController(roomService);

router.post("/", roomController.createRoom);
router.get("/:roomId", roomController.getRoom);

export default router;

