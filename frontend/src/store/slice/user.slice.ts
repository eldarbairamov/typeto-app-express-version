import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IUser, IUserBySearch } from "../../interface/user.interface.ts";
import { userService } from "../../service/user.service.ts";
import { AxiosError } from "axios";

interface IInitialState {
   contacts: IUser[];
   userBySearch: IUserBySearch;
   isLoading: boolean,
   errorMessage: string | undefined
}

const initialState: IInitialState = {
   contacts: [] as IUser[],
   userBySearch: {} as IUserBySearch,
   isLoading: false,
   errorMessage: undefined
};

const getContacts = createAsyncThunk<IUser[], { searchKey?: string }, { rejectValue: string }>(
    'user/getContacts',
    async ( { searchKey }, { rejectWithValue } ) => {
       try {
          const { data } = await userService.getContacts(searchKey);
          return data;

       } catch (e) {
          const axiosError = e as AxiosError;
          return rejectWithValue(axiosError.message);
       }
    }
);

const addContact = createAsyncThunk<void, { contactId: number }, { rejectValue: string }>(
    'user/addContact',
    async ( { contactId }, { rejectWithValue } ) => {
       try {
          await userService.addContact(contactId);

       } catch (e) {
          const axiosError = e as AxiosError;
          return rejectWithValue(axiosError.message);
       }
    }
);

const findUser = createAsyncThunk<IUserBySearch, { userEmail: string }, { rejectValue: string }>(
    'user/findUser',
    async ( { userEmail }, { rejectWithValue } ) => {
       try {
          const { data } = await userService.findUser(userEmail);
          return data;

       } catch (e) {
          const axiosError = e as AxiosError;
          return rejectWithValue(axiosError.message);
       }

    }
);


const deleteContact = createAsyncThunk<IUser[], { contactId: number }, { rejectValue: string }>(
    'user/deleteContact',
    async ( { contactId }, { rejectWithValue } ) => {
       try {
          const { data } = await userService.deleteContact(contactId);
          return data;

       } catch (e) {
          const axiosError = e as AxiosError;
          return rejectWithValue(axiosError.message);
       }
    }
);

const userSlice = createSlice({
   name: "user",
   initialState,
   reducers: {

      setUser: ( state, { payload }: PayloadAction<IUserBySearch> ) => {
         state.userBySearch = payload;
      },

      groupModeMove: ( state, { payload }: PayloadAction<{ id: number, action: "delete" | "add", user?: IUser }> ) => {
         if (payload.action === 'delete' && payload.user) state.contacts.push(payload.user);
         if (payload.action === 'add') state.contacts = state.contacts.filter(contact => contact.id !== payload.id);
      },

   },

   extraReducers: builder => builder

       .addCase(getContacts.pending, ( state ) => {
          state.isLoading = true;
       })

       .addCase(getContacts.fulfilled, ( state, { payload } ) => {
          state.contacts = payload;
          state.isLoading = false;
       })

       .addCase(getContacts.rejected, ( state, { payload } ) => {
          state.errorMessage = payload;
          state.isLoading = false;
       })

       .addCase(findUser.pending, ( state ) => {
          state.isLoading = true;
       })

       .addCase(findUser.fulfilled, ( state, { payload } ) => {
          state.userBySearch = payload;
          state.isLoading = false;
       })

       .addCase(findUser.rejected, ( state, { payload } ) => {
          state.errorMessage = payload;
          state.isLoading = false;
       })

       .addCase(deleteContact.pending, ( state ) => {
          state.isLoading = true;
       })

       .addCase(deleteContact.fulfilled, ( state, { payload } ) => {
          state.contacts = payload;
          state.isLoading = false;
       })

       .addCase(deleteContact.rejected, ( state, { payload } ) => {
          state.errorMessage = payload;
          state.isLoading = false;
       })

       .addCase(addContact.pending, ( state ) => {
          state.isLoading = true;
       })

       .addCase(addContact.fulfilled, ( state ) => {
          state.isLoading = false;
       })

       .addCase(addContact.rejected, ( state, { payload } ) => {
          state.errorMessage = payload;
          state.isLoading = false;
       })

});

export const userActions = userSlice.actions;
export const userAsyncActions = { getContacts, findUser, addContact, deleteContact };
export const userReducer = userSlice.reducer;
