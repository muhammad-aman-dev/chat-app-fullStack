import express from "express";
import { getAllUsers, getMessages, sendMessage } from "../controllers/messageController.js";
import { isAuthenticated } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/allusers", isAuthenticated, getAllUsers);
router.get("/:id", isAuthenticated, getMessages);
router.post("/send/:id", isAuthenticated, sendMessage)

export default router;