import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IUser, IUserBySearch } from "../../interface/user.interface.ts";

interface IInitialState {
   contacts: IUser[];
   userBySearch: IUserBySearch;
}

const initialState: IInitialState = {
   contacts: [] as IUser[],
   userBySearch: {} as IUserBySearch
};

const userSlice = createSlice({
   name: "user",
   initialState,
   reducers: {

      setContacts: ( state, { payload }: PayloadAction<IUser[]> ) => {
         state.contacts = payload;
      },

      setUser: ( state, { payload }: PayloadAction<IUserBySearch> ) => {
         state.userBySearch = payload;
      },

      groupModeMove: ( state, { payload }: PayloadAction<{ id: number, action: "delete" | "add", user?: IUser }> ) => {
         if (payload.action === 'delete' && payload.user) state.contacts.push(payload.user);
         if (payload.action === 'add') state.contacts = state.contacts.filter(contact => contact.id !== payload.id);
      },

   }
});

export const userActions = userSlice.actions;
export const userReducer = userSlice.reducer;