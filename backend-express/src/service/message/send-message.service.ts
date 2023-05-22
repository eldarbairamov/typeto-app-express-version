import { Conversation, ConversationUser, Message, User } from "../../model";
import { Op } from "sequelize";

export const sendMessageService = async ( content: string, senderId: number, conversationId: number ) => {

   const newMessage = await Message.create({
      content,
      senderId,
      conversationId
   });

   const target = await Conversation.findByPk(conversationId);

   const [ messageWithSender ] = await Promise.all([
      Message.findByPk(newMessage.id, {
         include: {
            model: User,
            as: "sender",
            attributes: [ "id", "username", "email", "image" ]
         }
      }),
      target?.update({
         lastModified: Date.now()
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

   return messageWithSender;
};