import { axiosInstance } from "./axios.service.ts";
import { storageService } from "./storage.service.ts";
import { IAccessTokenPair, ILogin, IRegistration } from "../interface/auth.interface.ts";
import { AxiosResponse } from "axios";

export const authService = {

   registration: async ( data: IRegistration ): Promise<void> => {
      await axiosInstance.post("/auth/registration", data);
   },

   login: async ( body: ILogin ): Promise<AxiosResponse<IAccessTokenPair>> => {
      return await axiosInstance.post<IAccessTokenPair>("/auth/login", body);

   },

   logout: async ( next: () => void ) => {
      await axiosInstance.get("/auth/logout");
      storageService.deleteTokens();
      next();
   }

};