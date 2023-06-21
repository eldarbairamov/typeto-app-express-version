import { Conversation, ConversationUser, User } from "../model";
import { Op } from "sequelize";

export const kickUserService = async ( conversationId: number, whoWasKickedId: number, adminId: number ) => {

   const conversation = await Conversation.findByPk( conversationId );

   const whoWillSeeChanges = await ConversationUser.findAll( {
      where: {
         conversationId,
         [Op.and]: [
            {
               userId: {
                  [Op.ne]: adminId
               }
            },
            {
               userId: {
                  [Op.ne]: whoWasKickedId
               }
            }
         ],

      },
   } )
       .then( conversationUser => conversationUser.map( c => c.userId ) );

   const whoIsAdmin = await User.findByPk( adminId, {
      attributes: [ "id", "username", "email", "image" ]
   } );

   return { conversation, whoWillSeeChanges, whoIsAdmin };
};
