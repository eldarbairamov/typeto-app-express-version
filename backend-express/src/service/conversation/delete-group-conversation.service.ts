import { Conversation, ConversationUser, Message, User } from "../../model";
import { ApiException } from "../../exception/api.exception";
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