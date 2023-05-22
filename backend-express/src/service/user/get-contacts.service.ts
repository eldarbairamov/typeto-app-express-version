import { User } from "../../model";

export const getContactsService = async ( searchKey: string, currentUserId: number ) => {

   return await User.findOne({
      where: {
         id: currentUserId
      },
      include: "contacts"
   })
       .then(user => {
          const contacts = user?.contacts;
          return searchKey ? contacts?.filter(contact => contact.username.match(searchKey)) : contacts;
       });

};