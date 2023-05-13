import { IUserFromConversation } from "./user.interface.ts";

export interface IConversation {
   id: number;
   conversationName: string;
   isGroupConversation: boolean;
   adminId: number;
   lastModified: number;
   conversationWith: IUserFromConversation[];
   users: IUserFromConversation[];
}

export interface IActiveConversation extends IConversation {
   username?: string;
}
