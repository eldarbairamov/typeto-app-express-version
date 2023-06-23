import { User } from "../../model";
import fileUpload, { FileArray } from "express-fileupload";
import { imageService } from "../image.service";

export const uploadAvatarService = async ( userId: number, files: FileArray ): Promise<string> => {

   const user = await User.findByPk( userId );

   const avatar = files?.avatar as fileUpload.UploadedFile;

   if ( user?.image ) await imageService.delete( user.email, user.image );

   const { imageName } = await imageService.process( avatar, user?.email! );

   await user?.update( { image: imageName }, { hooks: false } );

   return imageName;
};