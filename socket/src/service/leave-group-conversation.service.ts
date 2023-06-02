import { Conversation, User } from "../model";
import { conversationPresenter } from "../presenter";
import { IConversation } from "../interface";

export const leaveGroupConversationService = async ( conversationId: number ) => {

   return await Conversation.findByPk(conversationId, {
      include: {
         model: User,
         as: "users",
         attributes: [ "id", "username", "email", "image" ],
      },
   })
       .then(conversation => {

          if (conversation && !conversation.isGroupConversation) return conversationPresenter(conversation?.toJSON());
          return conversation;

       }) as IConversation;
};