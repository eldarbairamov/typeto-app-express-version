import { Conversation, ConversationUser, Message, User } from "../../model";
import { Op } from "sequelize";
import { groupConversationPresenter, privateConversationPresenter } from "../../presenter";

export const getConversationsService = async ( currentUserId: number ) => {

   const conversationsIds = await ConversationUser.findAll({
      where: { userId: currentUserId }
   })
       .then(res => res.map(item => item.conversationId));

   return await Conversation.findAll({
      where: { id: { [Op.in]: conversationsIds } },
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
            as: "messages",
         }
      ],
      order: [
         [ "lastModified", "DESC" ]
      ]
   })
       .then(res => {
          if (res) return res.map(item => {
             if (item.isGroupConversation) return groupConversationPresenter(item.toJSON(), currentUserId);
             if (!item.isGroupConversation) return privateConversationPresenter(item.toJSON(), currentUserId);
          });
          return res;
       });

};