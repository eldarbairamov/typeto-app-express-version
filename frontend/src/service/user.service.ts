import { axiosInstance } from "./axios.service.ts";
import { IUser, IUserBySearch } from "../interface/user.interface.ts";
import { AxiosResponse } from "axios";

export const userService = {

   findUser: async ( userEmail: string ): Promise<AxiosResponse<IUserBySearch>> => {
      return await axiosInstance.get<IUserBySearch>("/users", { params: { userEmail } });
   },

   addContact: async ( contactId: number ): Promise<void> => {
      await axiosInstance.post("/users/add_contact", { contactId });
   },

   getContacts: async ( searchKey?: string ): Promise<AxiosResponse<IUser[]>> => {
      return await axiosInstance.get<IUser[]>(`users/contacts`, { params: { searchKey: searchKey ? searchKey : null } });
   },

   deleteContact: async ( contactId: number ): Promise<AxiosResponse<IUser[]>> => {
      return await axiosInstance.delete<IUser[]>("/users/delete_contact", { params: { contactId } });
   },

   uploadAvatar: async ( formData: FormData ): Promise<AxiosResponse<{ imageName: string }>> => {
      return await axiosInstance.patch<{ imageName: string }>("/users/avatar", formData);
   },

   deleteAvatar: async (): Promise<AxiosResponse<void>> => {
      return await axiosInstance.delete("/users/avatar");
   },

   getCurrentUser: async (): Promise<AxiosResponse<IUser>> => {
      return await axiosInstance.get<IUser>("/users/get_current_user");
   }

};