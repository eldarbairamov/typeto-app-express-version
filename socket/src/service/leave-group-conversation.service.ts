import { Conversation, Message, User } from "../model";
import { conversationPresenter } from "../presenter";
import { IConversation } from "../interface";

export const leaveGroupConversationService = async ( conversationId: number ) => {

   return await Conversation.findByPk( conversationId, {
      include: [
         {
            model: User,
            as: "users",
            attributes: [ "id", "username", "email", "image" ],
         },
         {
            model: Message,
            as: "lastMessage",
         }
      ],
      order: [
         [ { model: User, as: "users" }, "id", "ASC" ],
         [ { model: Message, as: "lastMessage" }, "id", "ASC" ],
      ]
   } )
       .then( conversation => {

          if ( conversation && !conversation.isGroupConversation ) return conversationPresenter( conversation?.toJSON() );
          return conversation;

       } ) as IConversation;
};