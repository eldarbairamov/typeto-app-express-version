import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IActiveConversation, IConversation } from "../../interface/conversation.interface.ts";

interface IInitialState {
    conversations: IConversation[];
    activeConversation: IActiveConversation;
}

const initialState: IInitialState = {
    conversations: [] as IConversation[],
    activeConversation: {} as IActiveConversation
};

const conversationSlice = createSlice({
    name: "conversation",
    initialState,
    reducers: {

        setConversations: ( state, { payload }: PayloadAction<IConversation[]> ) => {
            state.conversations = payload.sort((a, b) => b.lastModified - a.lastModified);
        },

        createConversation: ( state, { payload }: PayloadAction<IConversation> ) => {
            state.conversations.push(payload);
            state.conversations = state.conversations.sort((a, b) => b.lastModified - a.lastModified)
        },

        setActiveConversation: ( state, { payload }: PayloadAction<IActiveConversation> ) => {
            state.activeConversation = payload;
        }
    }
});

export const conversationActions = conversationSlice.actions;
export const conversationReducer = conversationSlice.reducer;