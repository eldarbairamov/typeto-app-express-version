import expressAsyncHandler from "express-async-handler";
import { IRequest } from "../interface/express.interface";
import { Response } from "express";

export const messageController = {

   sendMessage: expressAsyncHandler(async ( req: IRequest<any, any, any>, res: Response ) => {

   }),

   getMessages: expressAsyncHandler(async ( req: IRequest<any, any, any>, res: Response ) => {

   })


};