import { Conversation, ConversationUser, Message, User } from "../model";
import { Op } from "sequelize";
import { conversationPresenter } from "../presenter/conversation.presenter";
import { IConversation } from "../interface";

export const deleteConversationService = async ( conversationWith: number ) => {
   const conversationsIds = await ConversationUser.findAll({
      where: {
         userId: conversationWith
      }
   })
       .then(res => res.map(item => item.conversationId));

   return await Conversation.findAll({
      where: {
         id: {
            [Op.in]: conversationsIds
         }
      },
      include: [
         {
            model: User,
            as: "users",
            attributes: [ "id", "username", "email", "image" ],
            through: {
               attributes: [ "isNewMessagesExist" ]
            }
         },
         {
            model: User,
            as: "admin",
            attributes: [ "id", "username", "email", "image" ],
         },
         {
            model: Message,
            as: "lastMessage",
         }
      ],
      order: [
         [ "lastModified", "DESC" ]
      ]
   })
       .then(res => {
          if (res) return res.map(item => conversationPresenter(item.toJSON(), undefined, conversationWith));
          return res;
       }) as IConversation;
};