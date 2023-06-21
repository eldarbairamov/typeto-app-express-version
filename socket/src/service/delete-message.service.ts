import { Conversation, ConversationUser, Message } from "../model";
import { Op } from "sequelize";

export const deleteMessageService = async ( conversationId: number, currentUserId: number ) => {

   const conversationWith = await ConversationUser.findAll( {
      where: {
         conversationId,
         userId: {
            [Op.ne]: currentUserId
         }
      },
   } )
       .then( conversationUser => conversationUser.map( c => c.userId ) );

   const updatedLastMessage = await Conversation.findByPk( conversationId, {
      include: {
         model: Message,
         as: "lastMessage"
      },
      order: [
         [ { model: Message, as: "lastMessage" }, "id", "DESC" ]
      ]
   } )
       .then( conversation => conversation?.lastMessage );

   return { conversationWith, updatedLastMessage };

};