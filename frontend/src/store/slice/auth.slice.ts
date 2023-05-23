import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { storageService } from "../../service/storage.service.ts";
import { IAccessTokenPair } from "../../interface/auth.interface.ts";
import { authService } from "../../service/auth.service.ts";
import { AxiosError } from "axios";
import { ILoginForm, IRegistrationForm } from "../../interface/form.interface.ts";

interface IInitialState {
   currentUserId: number;
   currentUsername: string;
   isLogin: boolean;
   isLoading: boolean;
   errorMessage: string | undefined;
}

const initialState: IInitialState = {
   currentUserId: Number(storageService.getUserId()),
   currentUsername: String(storageService.getUsername()),
   isLogin: !!storageService.getAccessToken(),
   isLoading: false,
   errorMessage: undefined,
};

const login = createAsyncThunk<IAccessTokenPair, { body: ILoginForm }, { rejectValue: string }>(
    "auth/login",
    async ( { body }, { rejectWithValue } ) => {
       try {
          const { data } = await authService.login(body);
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
          await authService.registration(data);

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
          await authService.logout();
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
   reducers: {

      setIsLogin: ( state, { payload }: PayloadAction<boolean> ) => {
         state.isLogin = payload;
      },
   },

   extraReducers: builder => builder

       .addCase(login.pending, ( state ) => {
          state.isLoading = true;
       })

       .addCase(login.fulfilled, ( state, { payload } ) => {
          state.isLoading = false;
          state.isLogin = true;

          storageService.setTokens({
             username: payload.username,
             accessToken: payload.accessToken,
             refreshToken: payload.refreshToken,
             userId: payload.userId
          });

       })

       .addCase(login.rejected, ( state, { payload } ) => {
          state.isLoading = false;
          state.errorMessage = payload;
       })

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

       .addCase(logout.pending, ( state ) => {
          state.isLoading = true;
       })

       .addCase(logout.fulfilled, ( state ) => {
          state.isLogin = false;
          state.isLoading = false;
          storageService.deleteAuthData();

       })

       .addCase(logout.rejected, ( state, { payload } ) => {
          state.isLoading = false;
          state.errorMessage = payload;
       })


});


export const authReducer = authSlice.reducer;
export const authAsyncActions = { login, registration, logout };
