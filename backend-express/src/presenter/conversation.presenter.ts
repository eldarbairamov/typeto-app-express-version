import { ConversationAttr } from "../model";

export const conversationPresenter = ( conversation: ConversationAttr, userId: number ) => {

    const { users, ...presentedData } = Object.assign(
        {},
        { ...conversation },
        { conversationWith: conversation.users.filter(user => user.id !== userId) });

    return conversation.isGroupConversation ? conversation : presentedData;
};