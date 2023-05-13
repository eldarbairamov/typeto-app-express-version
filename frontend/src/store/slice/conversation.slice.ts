import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IActiveConversation, IConversation } from "../../interface/conversation.interface.ts";
import { IUser } from "../../interface/user.interface.ts";

interface IInitialState {
   conversations: IConversation[];
   activeConversation: IActiveConversation;
   groupMembers: IUser[];
}

const initialState: IInitialState = {
   conversations: [] as IConversation[],
   activeConversation: {} as IActiveConversation,
   groupMembers: [] as IUser[]
};

const conversationSlice = createSlice({
   name: "conversation",
   initialState,
   reducers: {

      setConversations: ( state, { payload }: PayloadAction<IConversation[]> ) => {
         state.conversations = payload.sort(( a, b ) => b.lastModified - a.lastModified);
      },

      createConversation: ( state, { payload }: PayloadAction<IConversation> ) => {
         state.conversations.push(payload);
         state.conversations = state.conversations.sort(( a, b ) => b.lastModified - a.lastModified);
      },

      setActiveConversation: ( state, { payload }: PayloadAction<IActiveConversation> ) => {
         state.activeConversation = payload;
      },

      addContactToGroup: ( state, { payload }: PayloadAction<IUser> ) => {
         state.groupMembers.push(payload);
      },

      resetGroupMembers: ( state ) => {
         state.groupMembers = [];
      },

      deleteContactFromGroup: ( state, { payload }: PayloadAction<{ id: number }> ) => {
         state.groupMembers = state.groupMembers.filter(member => member.id !== payload.id);
      }
   }
});

export const conversationActions = conversationSlice.actions;
export const conversationReducer = conversationSlice.reducer;