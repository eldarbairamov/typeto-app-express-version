import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { AxiosError } from "axios";
import { IAccessTokenPair, ILoginForm, IRegistrationForm } from "../../interface";
import { authApi, storageApi } from "../../api";

interface IInitialState {
   isLogin: boolean;
   isLoading: boolean;
   errorMessage: string | undefined;
}

const initialState: IInitialState = {
   isLogin: !!storageApi.getAccessToken(),
   isLoading: false,
   errorMessage: undefined,
};

const login = createAsyncThunk<IAccessTokenPair, { body: ILoginForm }, { rejectValue: string }>(
    "auth/login",
    async ( { body }, { rejectWithValue } ) => {
       try {
          const { data } = await authApi.login(body);
          return data;

       }
       catch (e) {
          const axiosError = e as AxiosError;
          return rejectWithValue(axiosError.message);
       }
    }
);

const registration = createAsyncThunk<void, { data: IRegistrationForm }, { rejectValue: string }>(
    "auth/registration",
    async ( { data }, { rejectWithValue } ) => {
       try {
          await authApi.registration(data);

       }
       catch (e) {
          const axiosError = e as AxiosError;
          return rejectWithValue(axiosError.message);
       }
    }
);

const logout = createAsyncThunk<void, void, { rejectValue: string }>(
    "auth/logout",
    async ( _, { rejectWithValue } ) => {
       try {
          await authApi.logout();
       }
       catch (e) {
          const axiosError = e as AxiosError;
          return rejectWithValue(axiosError.message);
       }
    }
);


const authSlice = createSlice({
   name: "auth",
   initialState,
   reducers: {},
   extraReducers: builder => builder

       .addCase(login.pending, ( state ) => {
          state.isLoading = true;
       })

       .addCase(login.fulfilled, ( state, { payload } ) => {
          state.isLoading = false;
          state.isLogin = true;

          storageApi.setTokens({
             accessToken: payload.accessToken,
             refreshToken: payload.refreshToken,
          });

       })

       .addCase(login.rejected, ( state, { payload } ) => {
          state.isLoading = false;
          state.errorMessage = payload;
       })

       // *************** //

       .addCase(registration.pending, ( state ) => {
          state.isLoading = true;
       })

       .addCase(registration.fulfilled, ( state ) => {
          state.isLoading = false;
       })

       .addCase(registration.rejected, ( state, { payload } ) => {
          state.isLoading = false;
          state.errorMessage = payload;
       })

       // *************** //

       .addCase(logout.pending, ( state ) => {
          state.isLoading = true;
       })

       .addCase(logout.fulfilled, ( state ) => {
          state.isLogin = false;
          state.isLoading = false;
          storageApi.deleteAuthData();

       })

       .addCase(logout.rejected, ( state, { payload } ) => {
          state.isLoading = false;
          state.errorMessage = payload;
       })


});


export const authReducer = authSlice.reducer;
export const authAsyncActions = { login, registration, logout };
