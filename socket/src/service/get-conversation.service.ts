import { Conversation, Message, User } from "../model";
import { groupConversationPresenter } from "../presenter/group-conversation.presenter";
import { privateConversationPresenter } from "../presenter/private-conversation.presenter";
import { IConversation } from "../interface";

export const getConversationService = async ( conversationId: number, senderId: number, whoWillReceive: "sender" | "receiver" ) => {

   const receiverId = await Conversation.findByPk(conversationId, {
      include:
          {
             model: User,
             as: "users",
             attributes: [ "id", "username", "email", "image" ],
          }
   })
       .then(res => res?.users.find(u => u.id !== senderId)?.id) as number;

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
         [ { model: User, as: "users" }, "id", "ASC" ]
      ]
   })
       .then(res => {

          if (res && res.isGroupConversation) return groupConversationPresenter(res.toJSON(), whoWillReceive === "sender" ? senderId : receiverId);
          if (res && !res.isGroupConversation) return privateConversationPresenter(res.toJSON(), whoWillReceive === "sender" ? senderId : receiverId);

          return res;

       }) as IConversation;
};