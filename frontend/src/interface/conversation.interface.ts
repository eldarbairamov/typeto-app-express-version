import { IUserFromConversation } from "./user.interface.ts";

export interface IConversation {
    id: number;
    conversationName: string;
    isGroupConversation: boolean;
    adminId: number;
    lastModified: number;
    conversationWith: IUserFromConversation[];
}

export interface IActiveConversation {
    conversationId: number;
    username?: string;
    conversationName?: string;
}
