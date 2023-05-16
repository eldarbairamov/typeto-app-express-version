import expressAsyncHandler from "express-async-handler";
import { IRequest } from "../interface/express.interface";
import { Response } from "express";
import { Message, User } from "../model";

export const messageController = {

   sendMessage: expressAsyncHandler(async ( req: IRequest<{ content: string, conversationId: number }, any, any>, res: Response ) => {
      const { conversationId, content } = req.body;
      const senderId = req.userId as number;

      const newMessage = await Message.create({
         content,
         senderId,
         conversationId
      });

      const messageWithSender = await Message.findByPk(newMessage.id, {
         include: {
            model: User,
            as: 'sender',
            attributes: [ "id", "username", "email", "image" ]
         }
      });

      res.json(messageWithSender);
   }),

   getMessages: expressAsyncHandler(async ( req: IRequest<any, { conversationId: number }, any>, res: Response ) => {
      const conversationId = req.params.conversationId;

      const messages = await Message.findAll({
         where: { conversationId },
         attributes: [ 'id', "content", "conversationId", "lastModified" ],
         include: {
            model: User,
            as: 'sender',
            attributes: [ "id", "username", "email", "image" ]
         }
      });

      res.json(messages);
   })


};