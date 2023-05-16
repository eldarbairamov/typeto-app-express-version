import expressAsyncHandler from "express-async-handler";
import { IRequest } from "../interface/express.interface";
import { Response } from "express";
import { Conversation, ConversationUser, Message, User } from "../model";
import { Op } from "sequelize";
import { conversationPresenter } from "../presenter/conversation.presenter";

export const conversationController = {

   createConversation: expressAsyncHandler(async ( req: IRequest<{ userIds: number[], conversationName?: string }, any, any>, res: Response ) => {
      const { userIds, conversationName } = req.body;

      const newConversation = await Conversation.create({ conversationName, isGroupConversation: !!conversationName, adminId: conversationName ? req.userId : undefined });

      const promises = userIds.map(async ( id ) => await ConversationUser.create({
         conversationId: newConversation.id,
         userId: id
      }));

      await Promise.all(promises.concat([ ConversationUser.create({
         conversationId: newConversation.id,
         userId: req.userId!
      }) ]));

      const conversationWithUsers = await Conversation.findByPk(newConversation.id, {
         include: {
            model: User,
            as: "users",
            attributes: [ "id", "username", "email", "image" ],
         },
      }).then(res => {
         if (res && !conversationName) return conversationPresenter(res?.toJSON(), req.userId!);
         return res;
      });

      res.json(conversationWithUsers);
   }),

   getConversations: expressAsyncHandler(async ( req: IRequest<any, any, any>, res: Response ) => {
      const conversationsIds = await ConversationUser.findAll({
         where: { userId: req.userId }
      })
          .then(res => res.map(item => item.conversationId));

      const conversationList = await Conversation.findAll({
         where: { id: { [Op.in]: conversationsIds } },
         include: [
            {
               model: User,
               as: 'users',
               attributes: [ "id", "username", "email", "image" ],
            },
            {
               model: User,
               as: 'admin',
               attributes: [ "id", "username", "email", "image" ],
            },
            {
               model: Message,
               as: 'messages',
            }
         ],
      }).then(res => {
         if (res) return res.map(item => conversationPresenter(item.toJSON(), req.userId!));
         return res;
      });

      res.json(conversationList);
   }),

   deleteConversation: expressAsyncHandler(async ( req: IRequest<any, any, { conversationId: string }>, res: Response ) => {
      const conversationId = req.query.conversationId;

      const isConversationHasUsers = await Conversation
          .findByPk(conversationId, { include: 'users' })
          .then(res => {
             if (res) return Boolean(res?.users.length < 3);
          });

      await Promise.all([
         Conversation.destroy({ where: { id: conversationId } }),
         ConversationUser.destroy({ where: { conversationId }})
      ]);

      // if (isConversationHasUsers) {
      //    await Promise.all([
      //       Conversation.destroy({ where: { id: conversationId }, cascade: true }),
      //       ConversationUser.destroy({ where: { conversationId }, cascade: true })
      //    ]);
      //
      // } else {
      //    console.log('asd');
      //    await ConversationUser.destroy({
      //       where: {
      //          conversationId: conversationId,
      //       },
      //       cascade: true
      //    });
      // }

      const conversationsIds = await ConversationUser.findAll({
         where: { userId: req.userId }
      })
          .then(res => res.map(item => item.conversationId));

      const conversationList = await Conversation.findAll({
         where: { id: { [Op.in]: conversationsIds } },
         include: {
            model: User, as: "users",
            attributes: [ "id", "username", "email", "image" ],
         }
      }).then(res => {
         if (res) return res.map(item => conversationPresenter(item.toJSON(), req.userId!));
         return res;
      });

      res.json(conversationList);
   })

};