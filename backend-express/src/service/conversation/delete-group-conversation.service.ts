import { Conversation, ConversationUser, Message, User } from "../../model";
import { ApiException } from "../../exception/api.exception";
import { groupConversationPresenter, privateConversationPresenter } from "../../presenter";

export const deleteGroupConversationService = async ( conversationId: string, currentUserId: number ) => {

   // Define special variables for checking
   const [ isUserAdmin, isGroupConversation ] = await Conversation
       .findByPk(conversationId)
       .then(res => [
          Boolean(res?.adminId === currentUserId),
          Boolean(res?.isGroupConversation === true)
       ]);

   // Check results and throw errors if it's need
   if (!isGroupConversation) throw new ApiException("It is not group conversation", 400);
   if (!isUserAdmin) throw new ApiException("You are not admin", 401);

   // Delete conversation and ConversationUser record
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

   // Return presented data to client
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
               attributes: [ "id", "username", "email", "image" ],
               through: {
                  attributes: [ "isNewMessagesExist" ],
               },
            },
            {
               model: Message,
               as: "lastMessage"
            }
         ],
      },
      order: [
         [ { model: Conversation, as: "conversations", isSelfAssociation: true }, "lastModified", "DESC" ],
         [ "conversations", "lastMessage", "id", "ASC" ]
      ]
   })
       .then(user => {
          const conversations = user?.conversations || undefined;

          if (conversations) return conversations.map(c => {
             if (c.isGroupConversation) return groupConversationPresenter(c.toJSON(), currentUserId);
             if (!c.isGroupConversation) return privateConversationPresenter(c.toJSON(), currentUserId);
          })

          return conversations;
       });

};