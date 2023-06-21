import { NextFunction, Request, Response } from "express";
import expressAsyncHandler from "express-async-handler";
import { ApiException } from "../exception";
import { Conversation } from "../model";
import { IRequest } from "../interface";

export const commonMiddleware = {

   isRequestEmpty: expressAsyncHandler( async ( req: Request, res: Response, next: NextFunction ) => {
      if ( !Object.entries( req.body ).length ) throw new ApiException( "Request is empty", 400 );

      next();
   } ),

   isConversationExists: expressAsyncHandler( async ( req: IRequest<any, { conversationId: number }, { conversationId: number }>, res: Response, next: NextFunction ) => {
      let conversationId: number;

      if ( req.params.conversationId ) conversationId = req.params.conversationId;
      else conversationId = req.query.conversationId;

      const isConversationExists = await Conversation.findByPk( conversationId );
      if ( !isConversationExists ) throw new ApiException( "Conversation does not exist", 400 );

      next();
   } )

};