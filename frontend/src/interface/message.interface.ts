import { IUser } from "./user.interface.ts";

export interface IMessage {
   id: number;
   content: string;
   senderId: number;
   conversationId: number;
   lastModified: string;
   sender: IUser;
}