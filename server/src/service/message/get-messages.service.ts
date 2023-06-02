import { ConversationUser, Message, User } from "../../model";

export const getMessagesService = async ( conversationId: number, currentUserId: number ) => {

   const [ messages ] = await Promise.all([

      Message.findAll({
         where: { conversationId },
         attributes: [ "id", "content", "conversationId", "lastModified", "isImage" ],
         include: {
            model: User,
            as: "sender",
            attributes: [ "id", "username", "email", "image" ]
         },
         order: [
             ["id", "ASC"]
         ]
      }),

      ConversationUser.update({
         isNewMessagesExist: false
      }, {
         where: {
            conversationId,
            userId: currentUserId
         }
      })

   ]);

   return messages;
};