import { Conversation, User } from "../model";
import { conversationPresenter } from "../presenter";
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
       .then(conversation => {

          if (conversation && !conversation.isGroupConversation) return conversationPresenter(conversation?.toJSON(), whoCreatedId);
          return conversation;

       }) as IConversation;

};