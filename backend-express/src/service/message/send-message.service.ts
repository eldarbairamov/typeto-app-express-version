import { Conversation, ConversationUser, Message, User } from "../../model";
import { Op } from "sequelize";

export const sendMessageService = async ( content: string, senderId: number, conversationId: number ) => {

   // Create new message
   const newMessage = await Message.create({
      content,
      senderId,
      conversationId
   });

   // Define new message with sender, update current conversation, update ConversationUser record
   const [ messageWithSender ] = await Promise.all([

      Message.findByPk(newMessage.id, {
         include: {
            model: User,
            as: "sender",
            attributes: [ "id", "username", "email", "image" ]
         }
      }),

      Conversation.update({
             lastModified: Date.now()
          },
          {
             where: {
                id: conversationId
             }
          }),

      ConversationUser.update({
         isNewMessagesExist: true
      }, {
         where: {
            conversationId,
            userId: {
               [Op.ne]: senderId
            }
         }
      })

   ]);

   // Return message with sender to client

   return messageWithSender;
};