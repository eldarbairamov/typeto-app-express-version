import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface IWhoIsTyping {
   username: string,
   status: boolean
}

interface IInitialState {
   actionMessage: string | undefined;
   actionType: "info" | "error";
   isImTyping: boolean;
   whoIsTyping: IWhoIsTyping;
}

const initialState: IInitialState = {
   actionMessage: undefined,
   actionType: "info",
   isImTyping: false,
   whoIsTyping: {} as IWhoIsTyping,
};

export const appSlice = createSlice({
   name: "app",
   initialState,
   reducers: {

      setActionMessage: ( state, { payload }: PayloadAction<{ message: string | undefined, type?: "info" | "error" }> ) => {
         state.actionMessage = payload.message;
         if (payload.type) state.actionType = payload.type;
      },

      setIsImTyping: ( state, { payload }: PayloadAction<boolean> ) => {
         state.isImTyping = payload;
      },

      setWhoIsTyping: ( state, { payload }: PayloadAction<IWhoIsTyping> ) => {
         state.whoIsTyping = payload;
      }

   }
});

export const appActions = appSlice.actions;
export const appReducer = appSlice.reducer;