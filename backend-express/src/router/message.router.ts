import { Router } from "express";
import { messageController } from "../controller/message.controller";

export const messageRouter = Router();

messageRouter
    .get("/messages", messageController.getMessages)
    .post("/messages", messageController.sendMessage);
