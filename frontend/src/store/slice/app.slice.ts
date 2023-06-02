import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface IInitialState {
   actionMessage: string | undefined;
   actionType: "info" | "error";
}

const initialState: IInitialState = {
   actionMessage: undefined,
   actionType: "info"
};

export const appSlice = createSlice({
   name: "app",
   initialState,
   reducers: {

      setActionMessage: ( state, { payload }: PayloadAction<{ message: string | undefined, type?: "info" | "error" }> ) => {
         state.actionMessage = payload.message;

         if (payload.type) state.actionType = payload.type;
      },

   }
});

export const appActions = appSlice.actions;
export const appReducer = appSlice.reducer;