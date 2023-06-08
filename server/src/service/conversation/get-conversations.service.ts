import { Conversation, Message, User } from "../../model";
import { groupConversationPresenter, privateConversationPresenter } from "../../presenter";

export const getConversationsService = async ( currentUserId: number, limit: number ) => {

   // Find conversations by User record and return presented data to client
   const conversations = await User.findByPk(currentUserId, {
      include: {
         model: Conversation,
         as: "conversations",
         through: {
            attributes: [],
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
            },
         ],
      },
      order: [
         [ { model: Conversation, as: "conversations", isSelfAssociation: true }, "lastModified", "DESC" ],
         [ "conversations", "users", "id", "ASC" ],
         [ "conversations", "lastMessage", "id", "ASC" ]
      ],
      limit: 2,

   })
       .then(user => {
          const conversations = user?.conversations || undefined;

          if (conversations) return conversations.map(c => {
             if (c.isGroupConversation) return groupConversationPresenter(c.toJSON(), currentUserId);
             if (!c.isGroupConversation) return privateConversationPresenter(c.toJSON(), currentUserId);
          });

          return conversations;
       });

   return { data: conversations && Array.from(conversations).splice(0, limit), count: conversations?.length };

};