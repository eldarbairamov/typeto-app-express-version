import { Contacts } from "../../model";

export const addContactService = async ( contactId: number, currentUserId: number ) => {

   return await Contacts.create({
      userId: currentUserId!,
      contactId
   });

};