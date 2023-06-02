import { Conversation, Message } from "../../model";

export const deleteMessageService = async ( messageId: number, conversationId: number ) => {

   await Message.destroy({ where: { id: messageId } });

   return await Conversation.findByPk(conversationId, {
      include: {
         model: Message,
         as: "lastMessage"
      },
      order: [
         [ { model: Message, as: "lastMessage" }, "id", "DESC" ]
      ]
   })
       .then(conversation => conversation?.lastMessage);

};
