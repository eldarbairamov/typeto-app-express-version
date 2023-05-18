import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IActiveConversation, IConversation } from "../../interface/conversation.interface.ts";
import { IUser } from "../../interface/user.interface.ts";
import { AxiosError } from "axios";
import { conversationService } from "../../service/conversation.service.ts";

interface IInitialState {
   conversations: IConversation[];
   activeConversation: IActiveConversation;
   groupMembers: IUser[];
   isLoading: boolean,
   errorMessage: string | undefined
}

const initialState: IInitialState = {
   conversations: [] as IConversation[],
   activeConversation: {} as IActiveConversation,
   groupMembers: [] as IUser[],
   isLoading: false,
   errorMessage: undefined
};

const createConversation = createAsyncThunk<IConversation, { userIds: number[], conversationName?: string, username?: string }, { rejectValue: string }>(
    'conversation/createConversation',
    async ( { userIds, conversationName, username }, { rejectWithValue } ) => {
       try {
          const { data } = await conversationService.createConversation(userIds, conversationName);
          return data;

       } catch (e) {
          const axiosError = e as AxiosError;
          return rejectWithValue(axiosError.message);
       }
    }
);

const getConversations = createAsyncThunk<IConversation[], {}, { rejectValue: string }>(
    'conversation/getConversations',
    async ( {}, { rejectWithValue } ) => {
       try {
          const { data } = await conversationService.getConversations();
          return data;

       } catch (e) {
          const axiosError = e as Error;
          return rejectWithValue(axiosError.message);
       }
    }
);

const deleteConversation = createAsyncThunk<IConversation[], { conversationId: number }, { rejectValue: string }>(
    'conversation/deleteConversation',
    async ( { conversationId }, { rejectWithValue } ) => {
       try {
          const { data } = await conversationService.deleteConversation(conversationId);
          return data;

       } catch (e) {
          const axiosError = e as Error;
          return rejectWithValue(axiosError.message);
       }

    }
);

const deleteGroupConversation = createAsyncThunk<IConversation[], { conversationId: number }, { rejectValue: string }>(
    'conversation/deleteGroupConversation',
    async ( { conversationId }, { rejectWithValue } ) => {
       try {
          const { data } = await conversationService.deleteGroupConversation(conversationId);
          return data;

       } catch (e) {
          const axiosError = e as Error;
          return rejectWithValue(axiosError.message);
       }

    }
);

const leaveGroupConversation = createAsyncThunk<IConversation[], { conversationId: number }, { rejectValue: string }>(
    'conversation/leaveGroupConversation',
    async ( { conversationId }, { rejectWithValue } ) => {
       try {
          const { data } = await conversationService.leaveGroupConversation(conversationId);
          return data;

       } catch (e) {
          const axiosError = e as Error;
          return rejectWithValue(axiosError.message);
       }

    }
);

const conversationSlice = createSlice({
   name: "conversation",
   initialState,
   reducers: {

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
      },

      addConversation: ( state, { payload }: PayloadAction<IConversation> ) => {
         const username = payload.conversationWith[0].username;

         state.conversations.push(payload);
         state.conversations = state.conversations.sort(( a, b ) => b.lastModified - a.lastModified);
         state.activeConversation =
             !payload.isGroupConversation ? { ...payload, username: username ? username : undefined } : payload;
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
          state.conversations = payload.sort(( a, b ) => b.lastModified - a.lastModified);
          state.activeConversation = state.conversations[0];
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
          state.conversations = payload.sort(( a, b ) => b.lastModified - a.lastModified);
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
          state.conversations = payload.sort(( a, b ) => b.lastModified - a.lastModified);
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
          state.conversations = payload.sort(( a, b ) => b.lastModified - a.lastModified);
          state.activeConversation = state.conversations[0];
          state.isLoading = false;
       })

       .addCase(leaveGroupConversation.rejected, ( state, { payload } ) => {
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
   leaveGroupConversation
};
export const conversationReducer = conversationSlice.reducer;