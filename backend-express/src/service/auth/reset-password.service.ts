import { IResetPassword } from "../../interface/auth.interface";
import { ApiException } from "../../exception/api.exception";
import { resetPasswordValidator } from "../../validator/auth.validator";
import { ActionToken } from "../../model";
import { User } from "../../model";

export const resetPasswordService = async ( body: IResetPassword ) => {

   const validation = resetPasswordValidator.validate(body);
   if (validation.error) throw new ApiException(validation.error.message, 400);

   const actionTokenInfo = await ActionToken.findOne({ where: { token: body.resetPasswordToken } });
   if (!actionTokenInfo) throw new ApiException("Token invalid or expired", 401);

   await actionTokenInfo.destroy();

   await User.update({ password: body.password }, { where: { id: actionTokenInfo.ownerId } });
};