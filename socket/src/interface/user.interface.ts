export interface IUser {
   id: number;
   username: string;
   email: string;
   image: string | null;
}

export interface ISocketUser {
   userId: number;
   socketId: string
}

export interface IUserFromConversation extends IUser {
   ConversationUser: {
      conversationId: number,
      userId: number
   };
}