import { Contacts } from "../../model";

export const addContactService = async ( targetId: number, currentUserId: number ) => {

   await Contacts.create( {
      userId: currentUserId!,
      contactId: targetId
   } );

};