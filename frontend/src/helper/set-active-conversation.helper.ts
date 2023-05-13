import { IActiveConversation, IConversation } from "../interface/conversation.interface.ts";

export const setActiveConversation = ( conversations: IConversation[] ): IActiveConversation => {
   const { id, conversationName, conversationWith, isGroupConversation } = conversations[0];

   return {
      conversationId: id,
      conversationName: conversationName ? conversationName : undefined,
      username: !isGroupConversation ? conversationWith[0].username : undefined
   };
};