import { fileNameMaker, isFolderExists } from "../helper";
import path from "node:path";
import process from "process";
import { mkdir } from "fs/promises";
import fileUpload from "express-fileupload";
import sharp from "sharp";
import { deleteFileFolder } from "../helper";

export const imageService = {

   process: async ( image: fileUpload.UploadedFile, userEmail: string ) => {
      const imageName = fileNameMaker( image );
      const folderPath = path.join( process.cwd(), "client", userEmail );

      const isFoldExists = await isFolderExists( folderPath );
      if ( !isFoldExists ) await mkdir( folderPath, { recursive: true } );

      await sharp( image.data ).jpeg( { quality: 40 } ).toFile( path.join( folderPath, imageName ) );

      return { imageName };
   },

   delete: async ( userEmail: string, imageName: string ) => {
      const imagePath = path.join( process.cwd(), "client", userEmail, imageName );
      const isFoldExists = await isFolderExists( imagePath );
      isFoldExists && await deleteFileFolder( imagePath );
   }

};