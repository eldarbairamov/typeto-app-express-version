import { NextFunction, Request, Response } from "express";
import expressAsyncHandler from "express-async-handler";
import { ApiException } from "../exception/api.exception";

export const commonMiddleware = {

   isRequestEmpty: expressAsyncHandler(async ( req: Request, res: Response, next: NextFunction ) => {
      if (!Object.entries(req.body).length) throw new ApiException("Request is empty", 400);

      next();
   }),

};