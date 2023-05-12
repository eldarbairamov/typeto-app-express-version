import expressAsyncHandler from "express-async-handler";
import { IRequest } from "../interface/express.interface";
import { Response } from "express";
import { Conversation, ConversationUser, User } from "../model";
import { Op } from "sequelize";
import { conversationPresenter } from "../presenter/conversation.presenter";

export const conversationController = {

    createConversation: expressAsyncHandler(async ( req: IRequest<{ userId: number }, any, any>, res: Response ) => {
        const { userId } = req.body;

        const newConversation = await Conversation.create();

        await ConversationUser.bulkCreate([
            { conversationId: newConversation.id, userId: req.userId! },
            { conversationId: newConversation.id, userId: userId } ]);

        const conversationWithUsers = await Conversation.findByPk(newConversation.id, {
            include: {
                model: User,
                as: "users",
                attributes: [ "id", "username", "email", "image" ],
                where: { id: { [Op.ne]: req.userId } },
            },
        }).then(res => {
            if (res) return conversationPresenter(res?.toJSON());
            return res;
        });

        res.json(conversationWithUsers);
    }),

    getConversations: expressAsyncHandler(async ( req: IRequest<any, any, any>, res: Response ) => {
        const conversationsIds = await ConversationUser.findAll({
            where: { userId: req.userId }
        })
            .then(res => res.map(item => item.conversationId));

        const conversationList = await Conversation.findAll({
            where: { id: { [Op.in]: conversationsIds } },
            include: {
                model: User,
                as: 'users',
                where: { id: { [Op.ne]: req.userId } },
                attributes: [ "id", "username", "email", "image" ]
            }
        }).then(res => {
            if (res) return res.map(item => conversationPresenter(item.toJSON()));
            return res;
        });

        res.json(conversationList);
    }),

    deleteConversation: expressAsyncHandler(async ( req: IRequest<any, any, { conversationId: string }>, res: Response ) => {
        await Promise.all([
            Conversation.destroy({ where: { id: req.query.conversationId } }),
            ConversationUser.destroy({ where: { conversationId: req.query.conversationId } })
        ]);

        const conversationsIds = await ConversationUser.findAll({
            where: { userId: 1 }
        })
            .then(res => res.map(item => item.conversationId));

        const conversationList = await Conversation.findAll({
            where: { id: { [Op.in]: conversationsIds } },
            include: {
                model: User, as: "users",
                where: { id: { [Op.ne]: 1 } },
                attributes: [ "id", "username", "email", "image" ],
            }
        }).then(res => {
            if (res) return res.map(item => conversationPresenter(item.toJSON()));
            return res;
        });

        res.json(conversationList);
    })

};