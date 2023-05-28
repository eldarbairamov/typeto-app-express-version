import expressAsyncHandler from "express-async-handler";
import { IRequest } from "../interface";
import { NextFunction, Response } from "express";
import { ApiException } from "../exception/api.exception";
import { IImage } from "../interface/file.interface";
import { IMAGE_MAX_SIZE, IMAGE_MIMETYPES } from "../constant/upload-image.constant";

export const fileMiddleware = {

   imageChecker: expressAsyncHandler(( req: IRequest<any, any, any>, res: Response, next: NextFunction ) => {
      if (!req.files) throw new ApiException("There are no files in request", 400);

      const images = Object.values(req.files);

      for (const item of images) {
         const { size, mimetype } = item as IImage;

         if (size > IMAGE_MAX_SIZE) throw new ApiException("File size must be less than 10 mb", 413);
         if (!IMAGE_MIMETYPES.includes(mimetype)) throw new ApiException("Invalid file type", 422);
      }

      next();

   })

};