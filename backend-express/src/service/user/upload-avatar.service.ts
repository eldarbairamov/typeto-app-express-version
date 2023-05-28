import { User } from "../../model";
import fileUpload, { FileArray } from "express-fileupload";
import { fileNameMaker } from "../../helper/file-name-maker.helper";
import path from "node:path";
import process from "process";
import { exists } from "../../helper/exists.helper";
import { mkdir } from "fs/promises";
import sharp from "sharp";

export const uploadAvatarService = async ( userId: number, files: FileArray ) => {
   const user = await User.findByPk(userId);

   const avatar = files?.avatar as fileUpload.UploadedFile;

   const imageName = fileNameMaker(avatar);
   const folderPath = path.join(process.cwd(), "client", String(user?.email));

   const isFolderExists = await exists(folderPath);
   if (!isFolderExists) await mkdir(folderPath, { recursive: true });

   user?.set({ image: imageName });

   await user?.save({ hooks: false });
   await sharp(avatar.data).jpeg({ quality: 70 }).toFile(path.join(folderPath, imageName));

   return imageName
};