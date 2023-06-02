import { IAccessTokenPair } from "../interface";
import { ACCESS_TOKEN, REFRESH_TOKEN, USER_ID, USERNAME } from "../constant";

export const storageApi = {

   setTokens: ( { refreshToken, accessToken}: IAccessTokenPair ) => {
      localStorage.setItem(ACCESS_TOKEN, accessToken);
      localStorage.setItem(REFRESH_TOKEN, refreshToken);
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