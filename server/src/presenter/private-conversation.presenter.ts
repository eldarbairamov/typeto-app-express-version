import { ConversationAttr, ConversationUserAttr, User } from "../model";

export const privateConversationPresenter = ( conversation: ConversationAttr, userId: number ) => {

   const { users, ...presentedConversation } = Object.assign(
       {},
       { ...conversation },
       {
          conversationWith: conversation.users.filter( user => user.id !== userId )
       },
       {
          isNewMessagesExist: conversation.users
              .map( ( user ) => {

                 const userWithAssociation = user as User & { ConversationUser: ConversationUserAttr };

                 if ( userWithAssociation.id === userId ) return userWithAssociation.ConversationUser?.isNewMessagesExist;

                 return null;

              } )
              .filter( res => res !== null )[0]
       },
       {
          lastMessage: conversation.lastMessage
       }
   );

   return presentedConversation;
};