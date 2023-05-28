import { Conversation, ConversationUser, Message, User } from "../../model";
import { ApiException } from "../../exception/api.exception";
import { groupConversationPresenter, privateConversationPresenter } from "../../presenter";

export const deleteConversationService = async ( conversationId: string, currentUserId: number ) => {

   const isGroupConversation = await Conversation.findByPk(conversationId).then(res => Boolean(res?.isGroupConversation === true));
   if (isGroupConversation) throw new ApiException("You can not delete group conversation", 401);

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

   return await User.findByPk(currentUserId, {
      include: {
         model: Conversation,
         as: "conversations",
         through: {
            attributes: []
         },
         include: [
            {
               model: User,
               as: "users",
            },
            {
               model: Message,
               as: "messages"
            }
         ],
      }
   })
       .then(res => {
          const conversations = res?.conversations || undefined;

          if (conversations) return conversations.map(item => {
             if (item.isGroupConversation) return groupConversationPresenter(item.toJSON(), currentUserId);
             if (!item.isGroupConversation) return privateConversationPresenter(item.toJSON(), currentUserId);
          }).sort(( a, b ) => b.lastModified - a.lastModified);

          return conversations;
       });
};