import { Conversation, ConversationUser, User } from "../../model";
import { Op } from "sequelize";
import { ApiException } from "../../exception/api.exception";
import { groupConversationPresenter, privateConversationPresenter } from "../../presenter";

export const createConversationService = async ( userIds: number[], conversationName: string | undefined, currentUserId: number ) => {

   const isConversationExist = await Conversation.findAll({
      where: {
         isGroupConversation: false
      },
      include: [
         {
            model: User,
            as: "users",
            where: {
               id: {
                  [Op.in]: userIds.concat(currentUserId)
               }
            }
         }
      ],
   })
       .then(res => Boolean(res.filter(conv => conv.users.length === 2).length));

   if (isConversationExist && !conversationName) throw new ApiException("Conversation with this user is already exists", 400);

   const newConversation = await Conversation.create({
      conversationName,
      isGroupConversation: Boolean(conversationName),
      adminId: conversationName ? currentUserId : undefined
   });

   const promises = userIds.map(async ( id ) => await ConversationUser.create({
      conversationId: newConversation.id,
      userId: id
   }));

   await Promise.all(promises.concat([ ConversationUser.create({
      conversationId: newConversation.id,
      userId: currentUserId
   }) ]));

   return await Conversation.findByPk(newConversation.id, {
      include: {
         model: User,
         as: "users",
         attributes: [ "id", "username", "email", "image" ],
         through: {
            attributes: [ "isNewMessagesExist" ]
         }
      },
   })
       .then(res => {
          if (res?.isGroupConversation === true) return groupConversationPresenter(res?.toJSON(), currentUserId!);
          if (res?.isGroupConversation === false) return privateConversationPresenter(res?.toJSON(), currentUserId!);
          return res;
       });

};