import { Conversation, User } from "../../model";
import { groupConversationPresenter, privateConversationPresenter } from "../../presenter";
import { Op } from "sequelize";

export const getConversationsBySearchService = async ( currentUserId: number, searchKey: string ) => {

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
          .then(res => {
             const conversations = res?.conversations.map(c => groupConversationPresenter(c.toJSON(), currentUserId));
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
          .then(res => {
             const target = res?.conversations.find(c => c.users.find(u => u.username.match(searchKey)));
             if (target) return [ privateConversationPresenter(target.toJSON(), currentUserId) ];
             else return [];
          })


   ]);

   return groupConversations.length ? groupConversations : privateConversation;


};