import { Conversation, ConversationUser, Message, User } from "../../model";
import { Op } from "sequelize";

export const sendMessageService = async ( content: string, senderId: number, conversationId: number ): Promise<Message> => {

   const newMessage = await Message.create( {
      content,
      senderId,
      conversationId
   } );

   const [ messageWithSender ] = await Promise.all( [
      Message.findByPk( newMessage.id, {
         include: {
            model: User,
            as: "sender",
            attributes: [ "id", "username", "email", "image" ]
         }
      } ),
      Conversation.update( {
             lastModified: Date.now()
          },
          {
             where: {
                id: conversationId
             }
          } ),
      ConversationUser.update( {
         isNewMessagesExist: true
      }, {
         where: {
            conversationId,
            userId: {
               [Op.ne]: senderId
            }
         }
      } )
   ] );

   return messageWithSender!;
};