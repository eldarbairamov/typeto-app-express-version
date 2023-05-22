import { ConversationAttr, ConversationUserAttr, User } from "../model";

export const conversationPresenter = ( conversation: ConversationAttr, whoCreated?: number, whoWillReceive?: number ) => {
   const { messages, ...conv } = conversation;

   const { users, ...presentedData } = Object.assign(
       {},
       { ...conv },
       {
          conversationWith:
              whoCreated ? conv.users.filter(user => user.id === whoCreated) : conv.users.filter(user => user.id !== whoWillReceive)
       },
       {
          isNewMessagesExist: conv.users
              .map(( user ) => {
                 const userWithAssociation = user as User & { ConversationUser: ConversationUserAttr };

                 if (userWithAssociation.id === whoWillReceive) {
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

   return conversation.isGroupConversation ? conversation : presentedData;
};