import { ConversationAttr, ConversationUserAttr, User } from "../model";

export const groupConversationPresenter = ( conversation: ConversationAttr, userId: number ) => {
   const { messages, ...conv } = conversation;

   return Object.assign(
       {},
       conv,
       {
          isNewMessagesExist: conv.users
              .map(( user ) => {
                 const userWithAssociation = user as User & { ConversationUser: ConversationUserAttr };

                 if (userWithAssociation.id === userId) return userWithAssociation.ConversationUser.isNewMessagesExist;

                 return null;
              })
              .filter(res => res !== null)[0]
       },
       {
          lastMessage:
              messages ? conversation.messages.sort(( a, b ) => b.lastModified - a.lastModified)[0] : undefined
       });
};