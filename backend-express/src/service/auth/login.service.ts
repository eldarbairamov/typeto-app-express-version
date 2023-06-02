import { ILogin, IOAuthResponse } from "../../interface";
import { passwordService } from "../password.service";
import { ApiException } from "../../exception";
import { OAuth, User } from "../../model";
import { tokenService } from "../token.service";
import { loginValidator } from "../../validator";

export const loginService = async ( body: ILogin, user: User ): Promise<IOAuthResponse> => {
   const { password } = body;

   const validation = loginValidator.validate({ ...body });
   if (validation.error) throw new ApiException(validation.error.message, 400);

   const isPasswordSame = await passwordService.passComparer(password, user.password);
   if (!isPasswordSame) throw new ApiException("Wrong email or password", 400);

   const { accessToken, refreshToken } = tokenService.accessTokenPair(user.id);

   await OAuth.create({ accessToken, refreshToken, ownerId: user.id });

   return { accessToken, refreshToken };
};