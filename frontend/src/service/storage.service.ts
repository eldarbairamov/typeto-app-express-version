import { IAccessTokenPair } from "../interface/auth.interface.ts";
import { ACCESS_TOKEN, REFRESH_TOKEN, USER_ID, USERNAME } from "../constant/storage.constant.ts";

export const storageService = {

   setTokens: ( { refreshToken, accessToken, userId, username }: IAccessTokenPair ) => {
      localStorage.setItem(ACCESS_TOKEN, accessToken);
      localStorage.setItem(REFRESH_TOKEN, refreshToken);
      localStorage.setItem(USER_ID, String(userId));
      localStorage.setItem(USERNAME, username);
   },

   getAccessToken: () => localStorage.getItem(ACCESS_TOKEN),
   getUserId: () => localStorage.getItem(USER_ID),
   getUsername: () => localStorage.getItem(USERNAME),
   getRefreshToken: () => localStorage.getItem(REFRESH_TOKEN),

   deleteAuthData: () => {
      localStorage.removeItem(ACCESS_TOKEN);
      localStorage.removeItem(REFRESH_TOKEN);
      localStorage.removeItem(USER_ID);
      localStorage.removeItem(USERNAME);
   }

};