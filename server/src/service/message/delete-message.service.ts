import { Conversation, Message, User } from "../../model";
import { imageService } from "../image.service";
import { ApiException } from "../../exception";

export const deleteMessageService = async ( currentUserId: number, messageId: number, conversationId: number ) => {

   const [ message, user ] = await Promise.all( [
      Message.findOne( {
         where: { conversationId, id: messageId },
         attributes: [ "content", "isImage" ]
      } ),
      User.findByPk( currentUserId )
   ] );

   if ( !message ) throw new ApiException( "Message does not exist", 400 );

   if ( message?.isImage && user ) await imageService.delete( user.email, message.content );

   await Message.destroy( { where: { id: messageId } } );

   return await Conversation.findByPk( conversationId, {
      include: {
         model: Message,
         as: "lastMessage"
      },
      order: [
         [ { model: Message, as: "lastMessage" }, "id", "DESC" ]
      ]
   } )
       .then( conversation => conversation?.lastMessage );

};
