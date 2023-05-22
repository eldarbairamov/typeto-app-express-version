import { IUser } from "./user.interface.ts";

export interface IMessage {
   id: number;
   content: string;
   senderId: number;
   conversationId: number;
   lastModified: number;
   sender: IUser;
}

export interface INewMessageReceived {
   conversationId: number,
}