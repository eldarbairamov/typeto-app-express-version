import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { storageService } from "../../service/storage.service.ts";
import { IUserInfo } from "../../interface/auth.interface.ts";

interface IInitialState {
   currentUserInfo: IUserInfo;
   isLogin: boolean;
}

const initialState: IInitialState = {
   isLogin: !!storageService.getAccessToken(),
   currentUserInfo: { userId: 1 } as IUserInfo
};


const authSlice = createSlice({
   name: "auth",
   initialState,
   reducers: {
      setIsLogin: ( state, { payload }: PayloadAction<boolean> ) => {
         state.isLogin = payload;
      },
      setUserInfo: ( state, { payload }: PayloadAction<IUserInfo> ) => {
         state.currentUserInfo = payload;
         state.isLogin = true;
      }
   }
});


export const authActions = authSlice.actions;
export const authReducer = authSlice.reducer;
