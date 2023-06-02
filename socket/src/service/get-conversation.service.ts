import { Conversation, Message, User } from "../model";
import { IConversation } from "../interface";
import { groupConversationPresenter, privateConversationPresenter } from "../presenter";

export const getConversationService = async ( conversationId: number, senderId: number, whoWillReceive: "sender" | "receiver" ) => {

   const receiverId = await Conversation.findByPk(conversationId, {
      include:
          {
             model: User,
             as: "users",
             attributes: [ "id", "username", "email", "image" ],
          }
   })
       .then(conversation => conversation?.users.find(u => u.id !== senderId)?.id) as number;

   return await Conversation.findByPk(conversationId, {
      include: [
         {
            model: User,
            as: "users",
            attributes: [ "id", "username", "email", "image" ],
            through: {
               attributes: [ "isNewMessagesExist" ]
            },
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
         [ "lastModified", "DESC" ],
         [ { model: Message, as: "lastMessage" }, "id", "ASC" ],
         [ { model: User, as: "users" }, "id", "ASC" ]
      ]
   })
       .then(conversation => {

          if (conversation && conversation.isGroupConversation) return groupConversationPresenter(conversation.toJSON(), whoWillReceive === "sender" ? senderId : receiverId);
          if (conversation && !conversation.isGroupConversation) return privateConversationPresenter(conversation.toJSON(), whoWillReceive === "sender" ? senderId : receiverId);

          return conversation;

       }) as IConversation;
};