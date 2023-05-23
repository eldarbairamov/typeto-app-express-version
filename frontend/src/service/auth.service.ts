import { axiosInstance } from "./axios.service.ts";
import { IAccessTokenPair } from "../interface/auth.interface.ts";
import { AxiosResponse } from "axios";
import { ILoginForm, IRegistrationForm } from "../interface/form.interface.ts";

export const authService = {

   registration: async ( data: IRegistrationForm ): Promise<void> => {
      await axiosInstance.post("/auth/registration", data);
   },

   login: async ( body: ILoginForm ): Promise<AxiosResponse<IAccessTokenPair>> => {
      return await axiosInstance.post<IAccessTokenPair>("/auth/login", body);

   },

   logout: async (): Promise<void> => {
      await axiosInstance.get("/auth/logout");
   }

};