import { Conversation } from "../model/conversation.model";
import { User } from "../model/user.model";
import { conversationPresenter } from "../presenter/conversation.presenter";
import { IConversation } from "../interface/conversation.interface";
import { ConversationUser } from "../model/conversation-user.model";
import { Op } from "sequelize";
import { Message } from "../model/message.model";

export const ConversationRepository = {

   findByPk: async ( id: number, whoCreatedId?: number ): Promise<IConversation> => {
      return await Conversation.findByPk(id, {
         include: {
            model: User,
            as: "users",
            attributes: [ "id", "username", "email", "image" ],
         },
      })
          .then(res => {
             if (res && !res.isGroupConversation) return conversationPresenter(res?.toJSON(), whoCreatedId);
             return res;
          }) as IConversation;
   },

   findAll: async ( userId: number ) => {
      const conversationsIds = await ConversationUser.findAll({
         where: { userId }
      })
          .then(res => res.map(item => item.conversationId));

      return await Conversation.findAll({
         where: { id: { [Op.in]: conversationsIds } },
         include: [
            {
               model: User,
               as: "users",
               attributes: [ "id", "username", "email", "image" ],
            },
            {
               model: User,
               as: "admin",
               attributes: [ "id", "username", "email", "image" ],
            },
            {
               model: Message,
               as: "messages",
            }
         ],
      })
          .then(res => {
             if (res) return res.map(item => conversationPresenter(item.toJSON(), userId));
             return res;
          });
   }

};