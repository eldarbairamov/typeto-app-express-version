import { ISocketUser } from "../interface";

export const sessionManagerService = () => {

   let users: ISocketUser[] = [];

   const addUser = ( userId: number, socketId: string ) => {
      if ( !users.some( user => user.userId === userId ) ) users.push( { userId, socketId } );
   };

   const removeUser = ( socketId: string ) => users = users.filter( ( user ) => user.socketId !== socketId );

   const getUser = ( userId: number ) => users.find( ( user ) => user.userId === userId )?.socketId;

   const getUsers = ( userIds: number[] ) => {
      return users
          .map( ( user ) => {
             if ( userIds.includes( user.userId ) ) return user.socketId;
             return null;
          } )
          .filter( item => item !== null );
   };

   return { users, addUser, removeUser, getUser, getUsers };

};