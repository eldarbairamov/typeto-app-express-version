import { Conversation, ConversationUser, Message, User } from "../../model";
import { ApiException } from "../../exception/api.exception";
import { Op } from "sequelize";
import { groupConversationPresenter, privateConversationPresenter } from "../../presenter";

export const deleteGroupConversationService = async ( conversationId: string, currentUserId: number ) => {

   const [ isUserAdmin, isGroupConversation ] = await Conversation
       .findByPk(conversationId)
       .then(res => [
          Boolean(res?.adminId === currentUserId),
          Boolean(res?.isGroupConversation === true)
       ]);

   if (!isGroupConversation) throw new ApiException("It is not group conversation", 400);
   if (!isUserAdmin) throw new ApiException("You are not admin", 401);

   await Promise.all([
      Conversation.destroy({
         where: {
            id: conversationId
         }
      }),
      ConversationUser.destroy({
         where: {
            conversationId
         }
      })
   ]);

   const conversationsIds = await ConversationUser.findAll({
      where: {
         userId: currentUserId
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