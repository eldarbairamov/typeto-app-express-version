import { Router } from "express";
import { authMiddleware, commonMiddleware } from "../middleware";
import { messageController } from "../controller";

export const messageRouter = Router();

messageRouter
    .post(
        "/:conversationId",
        authMiddleware.isAccessExists,
        commonMiddleware.isRequestEmpty,
        commonMiddleware.isConversationExists,
        messageController.sendMessage
    )
    .post(
        "/:conversationId/image",
        authMiddleware.isAccessExists,
        commonMiddleware.isRequestEmpty,
        commonMiddleware.isConversationExists,
        messageController.sendImage
    )
    .get(
        "/:conversationId",
        authMiddleware.isAccessExists,
        commonMiddleware.isConversationExists,
        messageController.getMessages
    )
    .delete(
        "/:conversationId",
        authMiddleware.isAccessExists,
        commonMiddleware.isConversationExists,
        messageController.deleteMessage
    );

