import { Router } from "express";
import { authMiddleware } from "../middleware";
import { conversationController } from "../controller";

export const conversationRouter = Router();

conversationRouter
    .post("/", authMiddleware.isAccessExists, conversationController.createConversation)
    .get("/", authMiddleware.isAccessExists, conversationController.getConversations)
    .delete('/', authMiddleware.isAccessExists, conversationController.deleteConversation)
    .delete('/admin', authMiddleware.isAccessExists, conversationController.deleteGroupConversation)
    .delete('/leave', authMiddleware.isAccessExists, conversationController.leaveGroupConversation);