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
        }
    }
});

export const userActions = userSlice.actions;
export const userReducer = userSlice.reducer;