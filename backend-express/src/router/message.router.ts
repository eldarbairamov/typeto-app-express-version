import { Router } from "express";
import { authMiddleware } from "../middleware";
import { messageController } from "../controller";

export const messageRouter = Router();

messageRouter
    .get("/:conversationId", authMiddleware.isAccessExists, messageController.getMessages)
    .post("/", authMiddleware.isAccessExists, messageController.sendMessage);
