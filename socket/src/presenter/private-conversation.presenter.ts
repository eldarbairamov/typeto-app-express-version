import { ConversationAttr, ConversationUserAttr, User } from "../model";

export const privateConversationPresenter = ( conversation: ConversationAttr, userId: number ) => {
   const { messages, ...conv } = conversation;

   const { users, ...presentedConversation } = Object.assign(
       {},
       { ...conv },
       {
          conversationWith: conv.users.filter(user => user.id !== userId)
       },
       {
          isNewMessagesExist: conv.users
              .map(( user ) => {
                 const userWithAssociation = user as User & { ConversationUser: ConversationUserAttr };

                 if (userWithAssociation.id === userId) {
                    return userWithAssociation.ConversationUser.isNewMessagesExist;
                 }

                 return null;
              })
              .filter(res => res !== null)[0]
       },
       {
          lastMessage:
              messages ? conversation.messages.sort(( a, b ) => b.lastModified - a.lastModified)[0] : undefined
       }
   );

   return presentedConversation;
};