import { IRegistration } from "../../interface/auth.interface";
import { User } from "../../model";
import { ApiException } from "../../exception/api.exception";
import { registrationValidator } from "../../validator/auth.validator";
import { emailSender } from "../email.service";
import { REGISTRATION } from "../../constant/email-action.constant";

export const registrationService = async ( body: IRegistration ): Promise<void> => {
   const { username, password, email } = body;

   const validation = registrationValidator.validate({ ...body });
   if (validation.error) throw new ApiException(validation.error.message, 400);

   const isUsernameUsed = await User.findOne({ where: { username } });
   if (isUsernameUsed) throw new ApiException("This username is already in use", 409);

   await User.create({ username, email, password });

   await emailSender(email, REGISTRATION, { username: username });
};