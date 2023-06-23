import expressAsyncHandler from "express-async-handler";
import { Response } from "express";
import { IRequest } from "../interface";
import { addContactService, deleteAvatarService, deleteContactService, findUserService, getContactsService, uploadAvatarService } from "../service";
import { User } from "../model";

export const userController = {

   findUser: expressAsyncHandler( async ( req: IRequest<any, any, { userEmail: string }>, res: Response ) => {
      const userEmail = req.query.userEmail;
      const { user, isAlreadyAdded } = await findUserService( userEmail, req.userId! );
      res.json( { ...user, isAlreadyAdded: Boolean( isAlreadyAdded ) } );
   } ),

   getContacts: expressAsyncHandler( async ( req: IRequest<any, any, { searchKey: string }>, res: Response<User[] | undefined> ) => {
      const searchKey = req.query.searchKey;
      const usersContacts = await getContactsService( searchKey, req.userId! );
      res.json( usersContacts );
   } ),

   addContact: expressAsyncHandler( async ( req: IRequest<{ targetId: number }, any, any>, res: Response<{ message: string }> ) => {
      const targetId = req.body.targetId;
      await addContactService( targetId, req.userId! );
      res.json( { message: "Success" } );
   } ),

   deleteContact: expressAsyncHandler( async ( req: IRequest<any, any, { contactId: string }>, res: Response<User[] | undefined> ) => {
      const contactId = req.query.contactId;
      const usersContacts = await deleteContactService( +contactId, req.userId! );
      res.json( usersContacts );
   } ),

   getCurrentUser: expressAsyncHandler( async ( req: IRequest<any, any, any>, res: Response<User> ) => {
      const user = await User.findByPk( req.userId, {
         attributes: [ "id", "username", "email", "image" ]
      } );
      res.json( user! );
   } ),

   uploadAvatar: expressAsyncHandler( async ( req: IRequest<any, any, any>, res: Response<{ imageName: string }> ) => {
      const imageName = await uploadAvatarService( req.userId!, req.files! );
      res.json( { imageName } );
   } ),

   deleteAvatar: expressAsyncHandler( async ( req: IRequest<any, any, any>, res: Response<{ message: string }> ) => {
      await deleteAvatarService( req.userId! );
      res.json( { message: "Success" } );
   } )


};