import { ConversationAttr, ConversationUserAttr, User } from "../model";

export const conversationPresenter = ( conversation: ConversationAttr, whoCreated?: number, whoWillReceive?: number ) => {

   const { users, ...presentedData } = Object.assign(
       {},
       { ...conversation },
       {
          conversationWith:
              whoCreated ? conversation.users.filter(user => user.id === whoCreated) : conversation.users.filter(user => user.id !== whoWillReceive)
       },
       {
          isNewMessagesExist: conversation.users
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
          lastMessage: conversation.lastMessage
       }
   );

   return conversation.isGroupConversation ? conversation : presentedData;
};