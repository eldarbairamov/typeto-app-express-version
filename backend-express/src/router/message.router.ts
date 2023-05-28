import { Router } from "express";
import { authMiddleware } from "../middleware";
import { messageController } from "../controller";

export const messageRouter = Router();

messageRouter
    .post("/", authMiddleware.isAccessExists, messageController.sendMessage)
    .post("/image", authMiddleware.isAccessExists, messageController.sendImage)
    .get("/:conversationId", authMiddleware.isAccessExists, messageController.getMessages);
