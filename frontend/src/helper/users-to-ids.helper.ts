import { IUser } from "../interface/user.interface.ts";

export const usersToIds = ( users: IUser[], currentUserId: number ) => {
   return users
       .map(item => {
          if (item.id !== currentUserId) return item.id;
          return null;
       })
       .filter(id => id !== null);
};