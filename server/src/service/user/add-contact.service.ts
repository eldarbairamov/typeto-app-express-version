import { Contacts } from "../../model";

export const addContactService = async ( targetId: number, currentUserId: number ): Promise<void> => {

   await Contacts.create( {
      userId: currentUserId!,
      contactId: targetId
   } );

};