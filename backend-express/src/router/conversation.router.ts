import { Router } from "express";
import { conversationController } from "../controller/conversation.controller";
import { authMiddleware } from "../middleware/auth.middleware";

export const conversationRouter = Router();

conversationRouter
    .post("/", authMiddleware.isAccessExists, conversationController.createConversation)
    .get("/", authMiddleware.isAccessExists, conversationController.getConversations)
    .delete('/', authMiddleware.isAccessExists, conversationController.deleteConversation);