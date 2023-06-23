import { User } from "../../model";

export const getContactsService = async ( searchKey: string, currentUserId: number ): Promise<User[] | undefined> => {

   return await User.findOne( {
      where: {
         id: currentUserId
      },
      include: {
         association: "contacts",
         attributes: [ "id", "username", "email", "image" ]
      },
   } )
       .then( user => {
          const contacts = user?.contacts;
          return searchKey ? contacts?.filter( c => c.username.match( searchKey ) ) : contacts;
       } );

};