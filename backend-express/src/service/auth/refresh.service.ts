import { ApiException } from "../../exception/api.exception";
import { OAuth } from "../../model";
import { tokenService } from "../token.service";
import { REFRESH_TOKEN_TYPE } from "../../constant";

export const refreshService = async ( refreshToken: string ) => {

   if (!refreshToken) throw new ApiException("Token invalid or expired", 401);

   const isTokenExists = await OAuth.findOne({ where: { refreshToken } });
   if (!isTokenExists) throw new ApiException("Token invalid or expired", 401);

   const userId = tokenService.tokenVerify(refreshToken, REFRESH_TOKEN_TYPE);

   const accessTokenPair = tokenService.accessTokenPair(userId);

   await isTokenExists.destroy();

   await OAuth.create({ ownerId: userId, refreshToken: accessTokenPair.refreshToken, accessToken: accessTokenPair.accessToken });

   return accessTokenPair;

};