import { ConversationAttr } from "../model/conversation.model";

export const conversationPresenter = ( conversation: ConversationAttr, whoCreated?: number ) => {
   const { messages, ...conv } = conversation;

   const { users, ...presentedData } = Object.assign(
       {},
       { ...conv },
       { conversationWith: conv.users.filter(user => user.id === whoCreated) },
       { lastMessage: messages ? conversation.messages.sort(( a, b ) => b.lastModified - a.lastModified)[0] : undefined }
   );

   return conversation.isGroupConversation ? conversation : presentedData;
};