import { axiosInstance } from "./axios.service.ts";
import { AxiosResponse } from "axios";
import { IConversation } from "../interface/conversation.interface.ts";

export const conversationService = {

   createConversation: async ( userIds: number[], conversationName?: string ): Promise<AxiosResponse<IConversation>> => {
      return await axiosInstance.post<IConversation>("/conversations", { userIds, conversationName });
   },

   getConversations: async ( searchKey?: string ): Promise<AxiosResponse<IConversation[]>> => {
      return await axiosInstance.get<IConversation[]>("/conversations", {
         params: {
            searchKey: searchKey ? searchKey : null
         }
      });
   },

   deleteConversation: async ( conversationId: number ): Promise<AxiosResponse<IConversation[]>> => {
      return await axiosInstance.delete<IConversation[]>("/conversations", { params: { conversationId } });
   },

   deleteGroupConversation: async ( conversationId: number ): Promise<AxiosResponse<IConversation[]>> => {
      return await axiosInstance.delete<IConversation[]>("/conversations/admin", { params: { conversationId } });
   },

   leaveGroupConversation: async ( conversationId: number ): Promise<AxiosResponse<IConversation[]>> => {
      return await axiosInstance.delete<IConversation[]>("/conversations/leave", { params: { conversationId } });
   }

};