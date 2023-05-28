import expressAsyncHandler from "express-async-handler";
import { Response } from "express";
import { IRequest } from "../interface";
import { createConversationService, deleteConversationService, deleteGroupConversationService, getConversationsBySearchService, getConversationsService, leaveGroupConversationService } from "../service";

export const conversationController = {

   createConversation: expressAsyncHandler(async ( req: IRequest<{ userIds: number[], conversationName?: string }, any, any>, res: Response ) => {
      const { userIds, conversationName } = req.body;
      const conversationWithUsers = await createConversationService(userIds, conversationName, req.userId!);
      res.json(conversationWithUsers);
   }),

   getConversations: expressAsyncHandler(async ( req: IRequest<any, any, { searchKey?: string }>, res: Response ) => {
      const searchKey = req.query.searchKey;
      let conversationList;

      if (searchKey) conversationList = await getConversationsBySearchService(req.userId!, searchKey);
      else conversationList = await getConversationsService(req.userId!);

      res.json(conversationList);
   }),

   deleteGroupConversation: expressAsyncHandler(async ( req: IRequest<any, any, { conversationId: string }>, res: Response ) => {
      const conversationId = req.query.conversationId;
      const conversationList = await deleteGroupConversationService(conversationId, req.userId!);
      res.json(conversationList);
   }),

   leaveGroupConversation: expressAsyncHandler(async ( req: IRequest<any, any, { conversationId: string }>, res: Response ) => {
      const conversationId = req.query.conversationId;
      const conversationList = await leaveGroupConversationService(conversationId, req.userId!);
      res.json(conversationList);
   }),

   deleteConversation: expressAsyncHandler(async ( req: IRequest<any, any, { conversationId: string }>, res: Response ) => {
      const conversationId = req.query.conversationId;
      const conversationList = await deleteConversationService(conversationId, req.userId!);
      res.json(conversationList);
   })

};