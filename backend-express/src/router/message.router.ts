import { Router } from "express";
import { messageController } from "../controller/message.controller";
import { authMiddleware } from "../middleware/auth.middleware";

export const messageRouter = Router();

messageRouter
    .get("/:conversationId", authMiddleware.isAccessExists, messageController.getMessages)
    .post("/", authMiddleware.isAccessExists, messageController.sendMessage);
