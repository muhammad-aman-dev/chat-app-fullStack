import express from "express";
import { getAllUsers, getMessages, sendMessage } from "../controllers/messageController.js";
import { isAuthenticated } from "../middlewares/authMiddleware.js";
import { getChatUsers } from "../controllers/messageController.js";

const router = express.Router();

router.get("/allusers", isAuthenticated, getAllUsers);
router.get("/:id", isAuthenticated, getMessages);
router.post("/send/:id", isAuthenticated, sendMessage)
router.get("/getchatusers/:userId",isAuthenticated, getChatUsers)

export default router;