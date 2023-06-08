import { Conversation, ConversationUser, Message, User } from "../../model";
import fileUpload, { FileArray } from "express-fileupload";
import path from "node:path";
import process from "process";
import { mkdir } from "fs/promises";
import sharp from "sharp";
import { Op } from "sequelize";
import { exists, fileNameMaker } from "../../helper";

export const sendImageService = async ( userId: number, files: FileArray, conversationId: number ) => {
   const user = await User.findByPk(userId);

   const avatar = files?.image as fileUpload.UploadedFile;

   const imageName = fileNameMaker(avatar);
   const folderPath = path.join(process.cwd(), "client", String(user?.email));

   const isFolderExists = await exists(folderPath);
   if (!isFolderExists) await mkdir(folderPath, { recursive: true });

   const [ newMessage ] = await Promise.all([
      await Message.create({ content: imageName, conversationId, senderId: userId!, isImage: true }),
      await sharp(avatar.data).jpeg({ quality: 40 }).toFile(path.join(folderPath, imageName))
   ]);

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
               [Op.ne]: userId
            }
         }
      })

   ]);

   return messageWithSender;
};