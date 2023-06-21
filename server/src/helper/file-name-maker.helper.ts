import fileUpload from "express-fileupload";
import path from "node:path";

export const fileNameMaker = ( file: fileUpload.UploadedFile ) => {
   const ext = path.extname( file.name );
   return Date.now() + ext;
};