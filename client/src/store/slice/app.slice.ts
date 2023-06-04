import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface IInitialState {
   actionMessage: string | undefined;
   actionType: "info" | "error";
   isImTyping: boolean;
   isUserTyping: boolean;
}

const initialState: IInitialState = {
   actionMessage: undefined,
   actionType: "info",
   isImTyping: false,
   isUserTyping: false,
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

      setIsUserTyping: ( state, { payload } ) => {
         state.isUserTyping = payload;
      }

   }
});

export const appActions = appSlice.actions;
export const appReducer = appSlice.reducer;