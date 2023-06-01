import expressAsyncHandler from "express-async-handler";
import { Response } from "express";
import { IRequest } from "../interface";
import { getMessagesService, sendMessageService } from "../service";
import { sendImageService } from "../service/message/send-image.service";
import { Conversation, Message } from "../model";

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

      await Message.destroy({ where: { id: messageId } });

      const updatedLastMessage = await Conversation.findByPk(conversationId, {
         include: {
            model: Message,
            as: "lastMessage"
         },
         order: [
            [ { model: Message, as: "lastMessage" }, "id", "DESC" ]
         ]
      })
          .then(conversation => conversation?.lastMessage);

      res.json(updatedLastMessage);
   })

};