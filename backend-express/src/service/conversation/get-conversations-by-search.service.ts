import { Conversation, User } from "../../model";
import { groupConversationPresenter, privateConversationPresenter } from "../../presenter";
import { Op } from "sequelize";

export const getConversationsBySearchService = async ( currentUserId: number, searchKey: string ) => {

   // Find group and private conversations by search key
   const [ groupConversations, privateConversation ] = await Promise.all([

      User.findByPk(currentUserId, {
         include: {
            model: Conversation,
            as: "conversations",
            where: {
               isGroupConversation: true,
               conversationName: {
                  [Op.like]: `%${ searchKey }%`
               }
            },
            through: {
               attributes: []
            },
            include: [
               {
                  model: User,
                  as: "users",
               }
            ]
         }
      })
          .then(user => {
             const conversations = user?.conversations.map(c => groupConversationPresenter(c.toJSON(), currentUserId));
             if (conversations) return conversations;
             else return [];
          }),

      User.findByPk(currentUserId, {
         include: {
            model: Conversation,
            as: "conversations",
            where: {
               isGroupConversation: false
            },
            through: {
               attributes: []
            },
            include: [
               {
                  model: User,
                  as: "users",
               }
            ]
         }
      })
          .then(user => {
             const target = user?.conversations.find(c => c.users.find(u => u.username.match(searchKey)));
             if (target) return [ privateConversationPresenter(target.toJSON(), currentUserId) ];
             else return [];
          })

   ]);

   // Return presented data for client by condition
   return groupConversations.length ? groupConversations : privateConversation;

};