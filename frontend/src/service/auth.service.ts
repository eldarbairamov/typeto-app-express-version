import { axiosInstance } from "./axios.service.ts";
import { storageService } from "./storage.service.ts";
import { IUserInfo } from "../interface/auth.interface.ts";

export const authService = {

   registration: async ( data: {}, next: () => void ) => {
      await axiosInstance.post("/auth/registration", data);
      next();
   },

   login: async ( body: {}, next: ( response: IUserInfo ) => void ): Promise<void> => {
      const { data } = await axiosInstance.post<IUserInfo>("/auth/login", body);
      storageService.setTokens({ accessToken: data.accessToken, refreshToken: data.refreshToken });
      next(data);
   },

   logout: async ( next: () => void ) => {
      await axiosInstance.get("/auth/logout");
      storageService.deleteTokens();
      next();
   }

};