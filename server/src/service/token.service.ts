import jwt from "jsonwebtoken";
import { Secret } from "jsonwebtoken";
import { IAccessTokenPair } from "../interface";
import { config } from "../config";
import { ApiException } from "../exception";
import { ACCESS_TOKEN_TYPE, FORGOT_PASSWORD_TOKEN_TYPE, REFRESH_TOKEN_TYPE } from "../constant";

export const tokenService = {

   accessTokenPair: ( userId: number ): IAccessTokenPair => {
      try {
         return {
            accessToken: jwt.sign({ userId }, config.SECRET_ACCESS_TOKEN_KEY, { expiresIn: "1d" }),
            refreshToken: jwt.sign({ userId }, config.SECRET_REFRESH_TOKEN_KEY, { expiresIn: "7d" })
         };
      } catch (e) {
         const error = e as Error;
         console.log(error.message);
         throw new ApiException("JWT: Error", 500);
      }
   },

   tokenVerify: ( token: string, type: string ) => {
      let secretKey = "" as Secret;

      switch (type) {
         case ACCESS_TOKEN_TYPE:
            secretKey = config.SECRET_ACCESS_TOKEN_KEY;
            break;
         case REFRESH_TOKEN_TYPE:
            secretKey = config.SECRET_REFRESH_TOKEN_KEY;
            break;
         case FORGOT_PASSWORD_TOKEN_TYPE:
            secretKey = config.SECRET_FORGOT_PASS_KEY;
            break;
      }

      try {
         const { userId } = jwt.verify(token, secretKey) as { userId: number };
         return userId;

      } catch (e) {
         throw new ApiException("Token invalid or expired", 401);
      }
   }

};