import expressAsyncHandler from "express-async-handler";
import { Response } from "express";
import { IRequest } from "../interface/express.interface";
import { Contacts, User } from "../model";
import { ApiException } from "../exception/api.exception";

export const userController = {

   findUser: expressAsyncHandler(async ( req: IRequest<any, any, { userEmail: string }>, res: Response ) => {
      const [ user, isAlreadyAdded ] = await Promise.all([
         User.findOne({
            where: { email: req.query.userEmail },
            attributes: [ 'id', 'username', 'email', 'image' ]
         })
             .then(res => res?.dataValues),
         User.findByPk(1, {
            include: 'contacts'
         })
             .then(res => res?.contacts.find(contact => contact.email === req.query.userEmail))
      ]);

      if (!user) throw new ApiException("User is not found", 404);

      res.json({ ...user, isAlreadyAdded: Boolean(isAlreadyAdded) });
   }),

   getContacts: expressAsyncHandler(async ( req: IRequest<any, any, { searchKey: string }>, res: Response ) => {
      const { searchKey } = req.query;

      const usersContacts = await User.findOne({
         where: { id: req.userId },
         include: "contacts"
      })
          .then(user => {
             const contacts = user?.contacts;
             return searchKey ? contacts?.filter(contact => contact.username.match(searchKey)) : contacts;
          });

      res.json(usersContacts);
   }),

   addContact: expressAsyncHandler(async ( req: IRequest<{ contactId: number }, any, any>, res: Response ) => {
      await Contacts.create({
         userId: req.userId!,
         contactId: req.body.contactId
      });

      res.send('ok');
   }),

   deleteContact: expressAsyncHandler(async ( req: IRequest<any, any, { contactId: string }>, res: Response ) => {
      await Contacts.destroy({
         where: {
            userId: 1, contactId:
            req.query.contactId
         }
      });

      const usersContacts = await User.findOne({
         where: { id: 1 },
         include: "contacts"
      })
          .then(user => user?.contacts);

      res.send(usersContacts);
   })

};