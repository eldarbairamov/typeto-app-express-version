import { ConversationAttr, ConversationUserAttr, User } from "../model";

export const groupConversationPresenter = ( conversation: ConversationAttr, userId: number ) => {

   return Object.assign(
       {},
       conversation,
       {
          isNewMessagesExist: conversation.users
              .map( ( user ) => {
                 const userWithAssociation = user as User & { ConversationUser: ConversationUserAttr };

                 if ( userWithAssociation.id === userId ) {
                    return userWithAssociation.ConversationUser?.isNewMessagesExist;
                 }

                 return null;
              } )
              .filter( user => user !== null )[0]
       },
       {
          lastMessage: conversation.lastMessage
       } );
};