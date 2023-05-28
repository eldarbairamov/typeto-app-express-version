import { Conversation, ConversationUser, Message, User } from "../../model";
import { ApiException } from "../../exception/api.exception";
import { groupConversationPresenter, privateConversationPresenter } from "../../presenter";

export const leaveGroupConversationService = async ( conversationId: string, currentUserId: number ) => {

   const [ isUserAdmin, isGroupConversation ] = await Conversation
       .findByPk(conversationId)
       .then(res => [
          Boolean(res?.adminId === currentUserId),
          Boolean(res?.isGroupConversation === true)
       ]);

   if (!isGroupConversation) throw new ApiException("It is not group conversation", 400);

   if (isUserAdmin) throw new ApiException("Admin can not leave own conversation", 400);

   await ConversationUser.destroy({
      where: {
         conversationId,
         userId: currentUserId
      }
   });

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