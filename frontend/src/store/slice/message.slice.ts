import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { IMessage } from "../../interface/message.interface.ts";
import { messageService } from "../../service/message.service.ts";
import { AxiosError } from "axios";

interface IInitialState {
   messages: IMessage[];
   isLoading: boolean,
   errorMessage: string | undefined
}

const initialState: IInitialState = {
   messages: [] as IMessage[],
   isLoading: false,
   errorMessage: undefined
};

const getMessages = createAsyncThunk<IMessage[], { conversationId: number }, { rejectValue: string }>(
    'messages/getMessages',
    async ( { conversationId }, { rejectWithValue } ) => {
       try {
          const { data } = await messageService.getMessages(conversationId);
          return data;

       } catch (e) {
          const axiosError = e as AxiosError;
          return rejectWithValue(axiosError.message);
       }

    });

const messageSlice = createSlice({
   name: 'message',
   initialState,
   reducers: {},
   extraReducers: ( builder ) => builder

       .addCase(getMessages.pending, ( state ) => {
          state.isLoading = true;
       })
       .addCase(getMessages.fulfilled, ( state, { payload } ) => {
          state.messages = payload;
          state.isLoading = false;
       })
       .addCase(getMessages.rejected, ( state, { payload } ) => {
          state.errorMessage = payload;
          state.isLoading = false;
       })

});

export const messageActions = messageSlice.actions;
export const messageAsyncActions = { getMessages };
export const messageReducer = messageSlice.reducer;