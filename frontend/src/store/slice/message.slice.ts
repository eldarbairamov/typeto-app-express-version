import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
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
    "message/getMessages",
    async ( { conversationId }, { rejectWithValue } ) => {
       try {
          const { data } = await messageService.getMessages(conversationId);
          return data;

       }
       catch (e) {
          const axiosError = e as AxiosError;
          return rejectWithValue(axiosError.message);
       }

    });

const sendMessage = createAsyncThunk<IMessage, { content: string, conversationId: number }, { rejectValue: string }>(
    "message/sendMessage",
    async ( { content, conversationId }, { rejectWithValue } ) => {
       try {
          const { data } = await messageService.sendMessage(conversationId, content);
          return data;

       }
       catch (e) {
          const axiosError = e as AxiosError;
          return rejectWithValue(axiosError.message);
       }
    }
);

const sendImage = createAsyncThunk<IMessage, { formData: FormData}, { rejectValue: string }>(
    "message/sendImage",
    async ( { formData }, { rejectWithValue } ) => {
       try {
          const { data } = await messageService.sendImage(formData);
          return data;
       }
       catch (e) {
          const axiosError = e as AxiosError;
          return rejectWithValue(axiosError.message);
       }
    }
);


const messageSlice = createSlice({
   name: "message",
   initialState,
   reducers: {

      addMessage: ( state, { payload }: PayloadAction<IMessage> ) => {
         state.messages.push(payload);
      },

      resetMessages: ( state ) => {
         state.messages = [];
      }
   },
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

       // *************** //

       .addCase(sendMessage.fulfilled, ( state, { payload } ) => {
          state.messages.push(payload);
          state.isLoading = false;
       })

       // *************** //

       .addCase(sendImage.pending, ( state ) => {
          state.isLoading = true;
       })

       .addCase(sendImage.fulfilled, ( state, { payload } ) => {
          state.messages.push(payload);
          state.isLoading = false;
       })

       .addCase(sendImage.rejected, ( state, { payload } ) => {
          state.errorMessage = payload;
          state.isLoading = false;
       })

});

export const messageAsyncActions = { getMessages, sendMessage, sendImage };
export const messageActions = messageSlice.actions;
export const messageReducer = messageSlice.reducer;