import expressAsyncHandler from "express-async-handler";
import { Response } from "express";
import { IRequest } from "../interface";
import { deleteMessageService, getMessagesService, sendImageService, sendMessageService } from "../service";

export const messageController = {

   sendMessage: expressAsyncHandler(async ( req: IRequest<{ content: string, conversationId: number }, any, any>, res: Response ) => {
      const { conversationId, content } = req.body;
      const senderId = req.userId as number;
      const messageWithSender = await sendMessageService(content, senderId, conversationId);
      res.json(messageWithSender);
   }),

   getMessages: expressAsyncHandler(async ( req: IRequest<any, { conversationId: number }, any>, res: Response ) => {
      const conversationId = req.params.conversationId;
      const messages = await getMessagesService(conversationId, req.userId!);
      res.json(messages);
   }),

   sendImage: expressAsyncHandler(async ( req: IRequest<{ conversationId: number }, any, any>, res: Response ) => {
      const conversationId = req.body.conversationId;
      const messageWithSender = await sendImageService(req.userId!, req.files!, conversationId);
      res.json(messageWithSender);
   }),

   deleteMessage: expressAsyncHandler(async ( req: IRequest<any, { conversationId: number }, { messageId: number }>, res: Response ) => {
      const conversationId = req.params.conversationId;
      const messageId = req.query.messageId;
      const updatedLastMessage = await deleteMessageService(messageId, conversationId);
      res.json(updatedLastMessage);
   })

};