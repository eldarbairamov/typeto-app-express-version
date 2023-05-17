import expressAsyncHandler from "express-async-handler";
import { IRequest } from "../interface/express.interface";
import { Response } from "express";
import { Conversation, ConversationUser, Message, User } from "../model";
import { Op } from "sequelize";
import { conversationPresenter } from "../presenter/conversation.presenter";
import { ApiException } from "../exception/api.exception";
import { Sequelize } from "sequelize-typescript";

export const conversationController = {

   createConversation: expressAsyncHandler(async ( req: IRequest<{ userIds: number[], conversationName?: string }, any, any>, res: Response ) => {
      const { userIds, conversationName } = req.body;

      const isConversationExist = await ConversationUser.findAll({
         where: {
            userId: {
               [Op.in]: userIds.concat(req.userId!)
            }
         },
         attributes: [ 'conversationId' ],
         group: [ 'conversationId' ],
         having: Sequelize.literal(`COUNT(DISTINCT "userId") = ${ userIds.concat(req.userId!).length }`)
      })
          .then(res => Boolean(res.length));

      if (isConversationExist && !conversationName) throw new ApiException('Conversation with this user is already exists', 400);

      const newConversation = await Conversation.create({ conversationName, isGroupConversation: Boolean(conversationName), adminId: conversationName ? req.userId : undefined });

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

   deleteGroupConversation: expressAsyncHandler(async ( req: IRequest<any, any, { conversationId: string }>, res: Response ) => {
      const { conversationId } = req.query;

      const [ isUserAdmin, isGroupConversation ] = await Conversation.findByPk(conversationId).then(res => [ Boolean(res?.adminId === req.userId), Boolean(res?.isGroupConversation === true) ]);

      if (!isGroupConversation) throw new ApiException('It is not group conversation', 400);
      if (!isUserAdmin) throw new ApiException('You are not admin', 401);

      await Promise.all([
         await Conversation.destroy({ where: { id: conversationId } }),
         await ConversationUser.destroy({ where: { conversationId } })
      ]);

      const conversationsIds = await ConversationUser.findAll({
         where: { userId: req.userId }
      })
          .then(res => res.map(item => item.conversationId));

      const conversationList = await Conversation.findAll({
         where: { id: { [Op.in]: conversationsIds } },
         include: [
            {
               model: User, as: "users",
               attributes: [ "id", "username", "email", "image" ],
            },
            {
               model: User,
               as: 'admin',
               attributes: [ "id", "username", "email", "image" ],
            },
         ]
      }).then(res => {
         if (res) return res.map(item => conversationPresenter(item.toJSON(), req.userId!));
         return res;
      });

      res.json(conversationList);
   }),

   leaveGroupConversation: expressAsyncHandler(async ( req: IRequest<any, any, { conversationId: string }>, res: Response ) => {
      const { conversationId } = req.query;

      const [ isUserAdmin, isGroupConversation ] = await Conversation.findByPk(conversationId).then(res => [ Boolean(res?.adminId === req.userId), Boolean(res?.isGroupConversation === true) ]);

      if (!isGroupConversation) throw new ApiException('It is not group conversation', 400);

      if (isUserAdmin) throw new ApiException('Admin can not leave own conversation', 400);

      await ConversationUser.destroy({ where: { conversationId, userId: req.userId } });

      const conversationsIds = await ConversationUser.findAll({
         where: { userId: req.userId }
      })
          .then(res => res.map(item => item.conversationId));

      const conversationList = await Conversation.findAll({
         where: { id: { [Op.in]: conversationsIds } },
         include: [
            {
               model: User, as: "users",
               attributes: [ "id", "username", "email", "image" ],
            },
            {
               model: User,
               as: 'admin',
               attributes: [ "id", "username", "email", "image" ],
            },
         ]
      }).then(res => {
         if (res) return res.map(item => conversationPresenter(item.toJSON(), req.userId!));
         return res;
      });

      res.json(conversationList);
   }),

   deleteConversation: expressAsyncHandler(async ( req: IRequest<any, any, { conversationId: string }>, res: Response ) => {
      const conversationId = req.query.conversationId;

      const isGroupConversation = await Conversation.findByPk(conversationId).then(res => Boolean(res?.isGroupConversation === true));
      if (isGroupConversation) throw new ApiException('You can not delete group conversation', 401);

      await Promise.all([
         Conversation.destroy({ where: { id: conversationId } }),
         ConversationUser.destroy({ where: { conversationId } })
      ]);

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