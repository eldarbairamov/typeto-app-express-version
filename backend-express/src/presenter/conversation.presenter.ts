import { ConversationAttr } from "../model";

export const conversationPresenter = ( conversation: ConversationAttr ) => {
    const { users, ...presentedData } = Object.assign(
        {},
        { ...conversation },
        { conversationWith: conversation.users });

    return presentedData;
};