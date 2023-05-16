import { axiosInstance } from "./axios.service.ts";
import { AxiosPromise } from "axios";
import { IMessage } from "../interface/message.interface.ts";

export const messageService = {

   getMessages: async ( conversationId: number ): Promise<AxiosPromise<IMessage[]>> => {
      return await axiosInstance.get<IMessage[]>(`/messages/${ conversationId }`);
   },

   sendMessage: async ( conversationId: number, content: string ): Promise<AxiosPromise<IMessage>> => {
      return await axiosInstance.post<IMessage>('/messages', { conversationId, content });
   }
};