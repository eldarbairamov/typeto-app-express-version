import { IRequest } from "../interface";
import expressAsyncHandler from "express-async-handler";
import { NextFunction, Response } from "express";
import { ApiException } from "../exception";
import { OAuth, User } from "../model";
import { emailValidator } from "../validator";

export const authMiddleware = {

   isUserExists: expressAsyncHandler(async ( req: IRequest<{ email: string }, any, any>, res: Response, next: NextFunction ) => {
      const validation = emailValidator.validate({ email: req.body.email });
      if (validation.error) throw new ApiException(validation.error.message, 400);

      const user = await User.findOne({ where: { email: req.body.email } });
      if (!user) throw new ApiException("Wrong email or password", 401);

      req.user = user;

      next();
   }),

   isEmailUnique: expressAsyncHandler(async ( req: IRequest<{ email: string }, any, any>, res: Response, next: NextFunction ) => {
      const user = await User.findOne({ where: { email: req.body.email } });
      if (user) throw new ApiException("This email is already in use", 409);

      next();
   }),

   isAccessExists: expressAsyncHandler(async ( req: IRequest<any, any, any>, res: Response, next: NextFunction ) => {
      const token = req.headers.authorization?.split(" ")[1];
      if (!token) throw new ApiException("Token invalid or expired", 401);

      const isAccessTokenExists = await OAuth.findOne({ where: { accessToken: token } });
      if (!isAccessTokenExists) throw new ApiException("Token invalid or expired", 401);

      req.userId = isAccessTokenExists.ownerId;
      req.token = token;

      next();
   }),

};