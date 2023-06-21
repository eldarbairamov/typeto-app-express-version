import { Router } from "express";
import { authRouter } from "./auth.router";
import { userRouter } from "./user.router";
import { conversationRouter } from "./conversation.router";
import { messageRouter } from "./message.router";

export const appRouter = Router();

appRouter
    .use( "/auth", authRouter )
    .use( "/users", userRouter )
    .use( "/conversations", conversationRouter )
    .use( "/messages", messageRouter );
