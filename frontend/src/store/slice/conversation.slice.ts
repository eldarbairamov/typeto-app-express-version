import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IActiveConversation, IConversation } from "../../interface/conversation.interface.ts";
import { IUser } from "../../interface/user.interface.ts";
import { AxiosError } from "axios";
import { conversationService } from "../../service/conversation.service.ts";
import { IMessage } from "../../interface/message.interface.ts";

interface IInitialState {
   conversations: IConversation[];
   activeConversation: IActiveConversation;
   groupMembers: IUser[];
   isLoading: boolean;
   errorMessage: string | undefined;
   actionMessage: string | undefined;
   searchKey: string | undefined;
   isNewMessageIncome: boolean;
}

const initialState: IInitialState = {
   conversations: [] as IConversation[],
   activeConversation: {} as IActiveConversation,
   groupMembers: [] as IUser[],
   isLoading: false,
   errorMessage: undefined,
   actionMessage: undefined,
   searchKey: undefined,
   isNewMessageIncome: false,
};


const createConversation = createAsyncThunk<IConversation, { userIds: number[], conversationName?: string, username?: string }, {
   rejectValue: string
}>(
    "conversation/createConversation",
    // @ts-ignore
    async ( { userIds, conversationName, username }, { rejectWithValue } ) => {
       try {
          const { data } = await conversationService.createConversation(userIds, conversationName);
          return data;

       }
       catch (e) {
          const axiosError = e as AxiosError;
          return rejectWithValue(axiosError.message);
       }
    }
);

const getConversations = createAsyncThunk<IConversation[], { searchKey?: string }, { rejectValue: string }>(
    "conversation/getConversations",
    async ( { searchKey }, { rejectWithValue } ) => {
       try {
          const { data } = await conversationService.getConversations(searchKey);
          return data;

       }
       catch (e) {
          const axiosError = e as Error;
          return rejectWithValue(axiosError.message);
       }
    }
);

const deleteConversation = createAsyncThunk<IConversation[], { conversation: IConversation }, { rejectValue: string }>(
    "conversation/deleteConversation",
    async ( { conversation }, { rejectWithValue } ) => {
       try {
          const { data } = await conversationService.deleteConversation(conversation.id);
          return data;

       }
       catch (e) {
          const axiosError = e as Error;
          return rejectWithValue(axiosError.message);
       }

    }
);

const kickUserFromGroupConversation = createAsyncThunk<void, { conversationId: number, userId: number }, { rejectValue: string }>(
    "conversation/kickUserFromGroupConversation",
    async ( { conversationId, userId }, { rejectWithValue } ) => {
       try {
          await conversationService.kickUserFromGroupConversation(conversationId, userId);
       }
       catch (e) {
          const axiosError = e as AxiosError;
          return rejectWithValue(axiosError.message);
       }
    }
);

const deleteGroupConversation = createAsyncThunk<IConversation[], { conversation: IConversation }, { rejectValue: string }>(
    "conversation/deleteGroupConversation",
    async ( { conversation }, { rejectWithValue } ) => {
       try {
          const { data } = await conversationService.deleteGroupConversation(conversation.id);
          return data;

       }
       catch (e) {
          const axiosError = e as Error;
          return rejectWithValue(axiosError.message);
       }

    }
);

const leaveGroupConversation = createAsyncThunk<IConversation[], { conversation: IConversation }, { rejectValue: string }>(
    "conversation/leaveGroupConversation",
    async ( { conversation }, { rejectWithValue } ) => {
       try {
          const { data } = await conversationService.leaveGroupConversation(conversation.id);
          return data;

       }
       catch (e) {
          const axiosError = e as Error;
          return rejectWithValue(axiosError.message);
       }

    }
);

const conversationSlice = createSlice({
   name: "conversation",
   initialState,
   reducers: {

      setSearchKey: ( state, { payload }: PayloadAction<string | undefined> ) => {
         state.searchKey = payload;
      },

      addContactToGroup: ( state, { payload }: PayloadAction<IUser> ) => {
         state.groupMembers.push(payload);
      },

      resetGroupMembers: ( state ) => {
         state.groupMembers = [];
      },

      deleteContactFromGroup: ( state, { payload }: PayloadAction<{ id: number }> ) => {
         state.groupMembers = state.groupMembers.filter(member => member.id !== payload.id);
      },

      setActiveConversation: ( state, { payload }: PayloadAction<IActiveConversation> ) => {
         state.activeConversation = payload;
         state.conversations = state.conversations.map(c => {
            if (c.id === payload.id) {
               c.isNewMessagesExist = false;
               return c;
            }
            return c;
         });
      },

      liftConversation: ( state ) => {
         state.conversations.sort(( a, b ) => a.lastMessage.lastModified - b.lastMessage.lastModified);
      },

      addConversation: ( state, { payload }: PayloadAction<IConversation> ) => {
         const username = payload.conversationWith && payload.conversationWith[0].username;

         state.conversations.push(payload);
         state.activeConversation = !payload.isGroupConversation ? { ...payload, username: username ? username : undefined } : payload;
         state.conversations.sort(( a, b ) => b.lastModified - a.lastModified);
      },

      setConversations: ( state, { payload }: PayloadAction<IConversation[]> ) => {
         state.conversations = payload;
         state.activeConversation = state.conversations[0];
      },

      updateConversations: ( state, { payload }: PayloadAction<IConversation> ) => {
         state.conversations = state.conversations.map(c => {
            if (c.id === payload.id) {
               return payload;
            }
            return c;
         });

         if (state.activeConversation.id === payload.id) {
            state.activeConversation = payload;
         }

         state.conversations.sort(( a, b ) => b.lastModified - a.lastModified);
      },

      updateConversationAfterKickUser: ( state, { payload }: PayloadAction<{ whoWasKickedId: number, conversationId: number }> ) => {
         const { whoWasKickedId, conversationId } = payload;
         const target = state.conversations.find(c => c.id === conversationId);
         if (target) {
            target.users = target.users.filter(u => u.id !== whoWasKickedId);
            state.activeConversation.users = state.activeConversation.users.filter(u => u.id !== whoWasKickedId);
         }
      },

      setActionMessage: ( state, { payload }: PayloadAction<string | undefined> ) => {
         state.actionMessage = payload;
      },

      deleteConversation: ( state, { payload }: PayloadAction<number> ) => {
         state.conversations = state.conversations.filter(c => c.id !== payload);
         state.activeConversation = state.conversations[0];
      },

      updateConversationAfterDeleteMessage: ( state, { payload }: PayloadAction<IMessage> ) => {
         const target = state.conversations.find(c => c.id === payload.conversationId);
         if (target) target.lastMessage = payload;
      }

   },

   extraReducers: builder => builder

       .addCase(createConversation.pending, ( state ) => {
          state.isLoading = true;
       })

       .addCase(createConversation.fulfilled, ( state, { payload, meta } ) => {
          const { username } = meta.arg;
          state.conversations.push(payload);
          state.activeConversation =
              !payload.isGroupConversation ? { ...payload, username: username ? username : undefined } : payload;
          state.conversations = state.conversations.sort(( a, b ) => b.lastModified - a.lastModified);
          state.isLoading = false;
       })

       .addCase(createConversation.rejected, ( state, { payload } ) => {
          state.errorMessage = payload;
          state.isLoading = false;
       })

       // *************** //

       .addCase(getConversations.pending, ( state ) => {
          state.isLoading = true;
       })

       .addCase(getConversations.fulfilled, ( state, { payload } ) => {
          state.conversations = payload;
          state.isLoading = false;
       })

       .addCase(getConversations.rejected, ( state, { payload } ) => {
          state.errorMessage = payload;
          state.isLoading = false;
       })

       // *************** //

       .addCase(deleteConversation.pending, ( state ) => {
          state.isLoading = true;
       })

       .addCase(deleteConversation.fulfilled, ( state, { payload } ) => {
          state.conversations = payload;
          state.activeConversation = state.conversations[0];
          state.isLoading = false;
       })

       .addCase(deleteConversation.rejected, ( state, { payload } ) => {
          state.isLoading = false;
          state.errorMessage = payload;
       })

       // *************** //

       .addCase(deleteGroupConversation.pending, ( state ) => {
          state.isLoading = true;
       })

       .addCase(deleteGroupConversation.fulfilled, ( state, { payload } ) => {
          state.conversations = payload;
          state.activeConversation = state.conversations[0];
          state.isLoading = false;
       })

       .addCase(deleteGroupConversation.rejected, ( state, { payload } ) => {
          state.isLoading = false;
          state.errorMessage = payload;
       })

       // *************** //

       .addCase(leaveGroupConversation.pending, ( state ) => {
          state.isLoading = true;
       })

       .addCase(leaveGroupConversation.fulfilled, ( state, { payload } ) => {
          state.conversations = payload;
          state.activeConversation = state.conversations[0];
          state.isLoading = false;
       })

       .addCase(leaveGroupConversation.rejected, ( state, { payload } ) => {
          state.isLoading = false;
          state.errorMessage = payload;
       })

       // *************** //

       .addCase(kickUserFromGroupConversation.pending, ( state ) => {
          state.isLoading = true;
       })

       .addCase(kickUserFromGroupConversation.fulfilled, ( state, { meta } ) => {
          state.isLoading = false;
          state.activeConversation.users = state.activeConversation.users.filter(u => u.id !== meta.arg.userId);
       })

       .addCase(kickUserFromGroupConversation.rejected, ( state, { payload } ) => {
          state.isLoading = false;
          state.errorMessage = payload;
       })

});

export const conversationActions = conversationSlice.actions;
export const conversationAsyncActions = {
   getConversations,
   createConversation,
   deleteConversation,
   deleteGroupConversation,
   leaveGroupConversation,
   kickUserFromGroupConversation
};
export const conversationReducer = conversationSlice.reducer;