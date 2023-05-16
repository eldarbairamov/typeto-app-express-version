import { IAccessTokenPair } from "../interface/auth.interface.ts";
import { ACCESS_TOKEN, REFRESH_TOKEN, USER_ID } from "../constant/storage.constant.ts";

export const storageService = {

   setTokens: ( { refreshToken, accessToken, userId }: IAccessTokenPair ) => {
      localStorage.setItem(ACCESS_TOKEN, accessToken);
      localStorage.setItem(REFRESH_TOKEN, refreshToken);
      localStorage.setItem(USER_ID, String(userId));
   },

   getAccessToken: () => localStorage.getItem(ACCESS_TOKEN),
   getUserId: () => localStorage.getItem(USER_ID),
   getRefreshToken: () => localStorage.getItem(REFRESH_TOKEN),

   deleteTokens: () => {
      localStorage.removeItem(ACCESS_TOKEN);
      localStorage.removeItem(REFRESH_TOKEN);
   }

};