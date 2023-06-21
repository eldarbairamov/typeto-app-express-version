import { Router } from "express";
import { authMiddleware, commonMiddleware } from "../middleware";
import { conversationController } from "../controller";

export const conversationRouter = Router();

conversationRouter
    .post(
        "/",
        authMiddleware.isAccessExists,
        conversationController.createConversation
    )
    .get(
        "/",
        authMiddleware.isAccessExists,
        conversationController.getConversations
    )
    .delete( "/",
        authMiddleware.isAccessExists,
        commonMiddleware.isConversationExists,
        conversationController.deleteConversation
    )
    .delete(
        "/admin",
        authMiddleware.isAccessExists,
        commonMiddleware.isConversationExists,
        conversationController.deleteGroupConversation
    )
    .delete(
        "/admin/kick",
        authMiddleware.isAccessExists,
        commonMiddleware.isConversationExists,
        conversationController.kickUserFromGroupConversation
    )
    .delete(
        "/leave",
        authMiddleware.isAccessExists,
        commonMiddleware.isConversationExists,
        conversationController.leaveGroupConversation
    );