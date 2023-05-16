import { ISocketUser } from "../interface/user.interface";

export const userService = () => {

   let users: ISocketUser[] = [];

   const addUser = ( userId: number, socketId: string ) => {
      if (!users.some(user => user.userId === userId)) {
         users.push({ userId, socketId });
      }
   };

   const removeUser = ( socketId: string ) => {
      users = users.filter(( user ) => user.socketId !== socketId);
   };

   const getUser = ( userId: number ) => {
      return users.find(( user ) => user.userId === userId);
   };

   return { addUser, removeUser, getUser, users };

};