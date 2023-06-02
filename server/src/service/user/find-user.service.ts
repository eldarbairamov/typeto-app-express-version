import { User } from "../../model";
import { ApiException } from "../../exception";

export const findUserService = async ( userEmail: string, currentUserId: number ) => {

   const [ user, isAlreadyAdded ] = await Promise.all([
      User.findOne({
         where: {
            email: userEmail
         },
         attributes: [ "id", "username", "email", "image" ]
      })
          .then(res => res?.dataValues),
      User.findByPk(currentUserId, {
         include: "contacts"
      })
          .then(user => user?.contacts.find(c => c.email === userEmail))
   ]);

   if (!user) throw new ApiException("User is not found", 404);

   return { user, isAlreadyAdded };
};