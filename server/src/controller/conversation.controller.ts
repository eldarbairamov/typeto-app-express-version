import expressAsyncHandler from "express-async-handler";
import { Response } from "express";
import { IRequest } from "../interface";
import { createConversationService, deleteConversationService, deleteGroupConversationService, getConversationsBySearchService, getConversationsService, leaveGroupConversationService } from "../service";
import { ConversationUser } from "../model";

export const conversationController = {

   createConversation: expressAsyncHandler( async ( req: IRequest<{
      userIds: number[],
      conversationName?: string
   }, any, any>, res: Response ) => {
      const { userIds, conversationName } = req.body;
      const conversationWithUsers = await createConversationService( userIds, conversationName, req.userId! );
      res.json( conversationWithUsers );
   } ),

   getConversations: expressAsyncHandler( async ( req: IRequest<any, any, {
      searchKey?: string,
      limit: number
   }>, res: Response ) => {
      const { searchKey, limit } = req.query;
      let conversationList;

      if ( searchKey ) conversationList = await getConversationsBySearchService( req.userId!, searchKey, limit );
      else conversationList = await getConversationsService( req.userId!, limit );

      res.json( conversationList );
   } ),

   deleteGroupConversation: expressAsyncHandler( async ( req: IRequest<any, any, {
      conversationId: number,
      limit: number
   }>, res: Response ) => {
      const { conversationId, limit } = req.query;
      const conversationList = await deleteGroupConversationService( conversationId, req.userId!, limit );
      res.json( conversationList );
   } ),

   leaveGroupConversation: expressAsyncHandler( async ( req: IRequest<any, any, {
      conversationId: number,
      limit: number
   }>, res: Response ) => {
      const { conversationId, limit } = req.query;
      const conversationList = await leaveGroupConversationService( conversationId, req.userId!, limit );
      res.json( conversationList );
   } ),

   deleteConversation: expressAsyncHandler( async ( req: IRequest<any, any, {
      conversationId: number,
      limit: number
   }>, res: Response ) => {
      const { conversationId, limit } = req.query;
      const conversationList = await deleteConversationService( conversationId, req.userId!, limit );
      res.json( conversationList );
   } ),

   kickUserFromGroupConversation: expressAsyncHandler( async ( req: IRequest<any, any, {
      conversationId: number,
      userId: number
   }>, res: Response ) => {
      const { conversationId, userId } = req.query;
      await ConversationUser.destroy( { where: { conversationId, userId } } );
      res.json( { message: "Success" } );
   } )

};