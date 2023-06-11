import jwt from "jsonwebtoken";
import { ActionToken, User } from "../../model";
import { config } from "../../config";
import { emailSender } from "../email.service";
import { FORGOT_PASSWORD, FORGOT_PASSWORD_TOKEN_TYPE } from "../../constant";

export const forgotPasswordService = async ( email: string, user: User, clientUrl: string ) => {
   const resetPasswordToken = jwt.sign({ userId: user.id }, config.SECRET_FORGOT_PASS_KEY, { expiresIn: "1d" });
   const resetPasswordLink = `${ clientUrl }/reset_password/new?token=${ resetPasswordToken }`;

   await ActionToken.create({
      token: resetPasswordToken,
      tokenType: FORGOT_PASSWORD_TOKEN_TYPE,
      ownerId: user.id,
   });

   await emailSender(email, FORGOT_PASSWORD, { resetPasswordLink, username: user.username });
};