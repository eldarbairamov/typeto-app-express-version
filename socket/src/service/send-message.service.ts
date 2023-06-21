import { Conversation, User } from "../model";
import { IMessage } from "../interface";
import { getConversationService } from "./get-conversation.service";

export const sendMessageService = async ( message: IMessage ) => {

   const [ conversationForSender, conversationForReceiver, users ] = await Promise.all( [

      getConversationService( message.conversationId, message.senderId, "sender" ),

      getConversationService( message.conversationId, message.senderId, "receiver" ),

      Conversation.findByPk( message.conversationId, {
         include: {
            model: User,
            as: "users",
            attributes: [ "id" ],
         }
      } ).then( conversation => conversation?.users.map( u => u.id ) )

   ] );

   return { conversationForSender, conversationForReceiver, users };

};