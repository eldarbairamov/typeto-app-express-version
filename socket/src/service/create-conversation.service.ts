import { Conversation, User } from "../model";
import { conversationPresenter } from "../presenter/conversation.presenter";
import { IConversation } from "../interface";

export const createConversationService = async ( conversationId: number, whoCreatedId: number ) => {

   return await Conversation.findByPk(conversationId, {
      include: {
         model: User,
         as: "users",
         attributes: [ "id", "username", "email", "image" ],
      },
      order: [
         [ { model: User, as: "users" }, "id", "ASC" ]
      ]
   })
       .then(res => {

          if (res && !res.isGroupConversation) return conversationPresenter(res?.toJSON(), whoCreatedId);
          return res;

       }) as IConversation;

};