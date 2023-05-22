import { Conversation, User } from "../model";
import { conversationPresenter } from "../presenter/conversation.presenter";
import { IConversation } from "../interface";

export const leaveGroupConversationService = async ( conversationId: number ) => {
   return await Conversation.findByPk(conversationId, {
      include: {
         model: User,
         as: "users",
         attributes: [ "id", "username", "email", "image" ],
      },
   })
       .then(res => {
          if (res && !res.isGroupConversation) return conversationPresenter(res?.toJSON());
          return res;
       }) as IConversation;
};