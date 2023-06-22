import { Conversation, ConversationUser, Message, User } from "../../model";
import fileUpload, { FileArray } from "express-fileupload";
import { Op } from "sequelize";
import { imageService } from "../image.service";

export const sendImageService = async ( senderId: number, files: FileArray, conversationId: number ) => {

   const userEmail = await User.findByPk( senderId, { attributes: [ "email" ] } ).then( res => res?.email );

   const image = files?.image as fileUpload.UploadedFile;

   const { imageName } = await imageService.process( image, userEmail! );

   const newMessage = await Message.create( { content: imageName, conversationId, senderId, isImage: true } );

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

   return messageWithSender;
};