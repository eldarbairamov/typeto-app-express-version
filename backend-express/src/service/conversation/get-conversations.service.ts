import { Conversation, Message, User } from "../../model";
import { groupConversationPresenter, privateConversationPresenter } from "../../presenter";

export const getConversationsService = async ( currentUserId: number ) => {

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