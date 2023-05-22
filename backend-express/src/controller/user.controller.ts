import expressAsyncHandler from "express-async-handler";
import { Response } from "express";
import { IRequest } from "../interface";
import { addContactService, deleteContactService, findUserService, getContactsService } from "../service";

export const userController = {

   findUser: expressAsyncHandler(async ( req: IRequest<any, any, { userEmail: string }>, res: Response ) => {
      const userEmail = req.query.userEmail;
      const { user, isAlreadyAdded } = await findUserService(userEmail, req.userId!);
      res.json({ ...user, isAlreadyAdded: Boolean(isAlreadyAdded) });
   }),

   getContacts: expressAsyncHandler(async ( req: IRequest<any, any, { searchKey: string }>, res: Response ) => {
      const { searchKey } = req.query;
      const usersContacts = await getContactsService(searchKey, req.userId!);
      res.json(usersContacts);
   }),

   addContact: expressAsyncHandler(async ( req: IRequest<{ contactId: number }, any, any>, res: Response ) => {
      const contactId = req.body.contactId;
      await addContactService(contactId, req.userId!);
      res.json({ message: "Success" });
   }),

   deleteContact: expressAsyncHandler(async ( req: IRequest<any, any, { contactId: string }>, res: Response ) => {
      const contactId = req.query.contactId;
      const usersContacts = await deleteContactService(+contactId, req.userId!);
      res.json(usersContacts);
   })

};