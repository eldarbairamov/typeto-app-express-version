import { IResetPassword } from "../../interface";
import { resetPasswordValidator } from "../../validator";
import { ApiException } from "../../exception";
import { ActionToken, User } from "../../model";

export const resetPasswordService = async ( body: IResetPassword ) => {

   const validation = resetPasswordValidator.validate( body );
   if ( validation.error ) throw new ApiException( validation.error.message, 400 );

   const actionTokenInfo = await ActionToken.findOne( { where: { token: body.resetPasswordToken } } );
   if ( !actionTokenInfo ) throw new ApiException( "Token invalid or expired", 401 );

   await actionTokenInfo.destroy();

   await User.update(
       { password: body.password },
       { where: { id: actionTokenInfo.ownerId }, individualHooks: true } );
};