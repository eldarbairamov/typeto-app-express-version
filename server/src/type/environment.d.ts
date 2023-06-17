import { User } from "../model";
import { Secret } from "jsonwebtoken";
import fileUpload from "express-fileupload";

export {};

declare global {
   namespace NodeJS {
      interface ProcessEnv {
         PORT: number;
         POSTGRES_DB: string;
         POSTGRES_HOST: string;
         POSTGRES_USER: string;
         POSTGRES_PASSWORD: string;
         POSTGRES_PORT: number;

         SECRET_ACCESS_TOKEN_KEY: Secret,
         SECRET_REFRESH_TOKEN_KEY: Secret,
         SECRET_FORGOT_PASS_KEY: Secret,
      }
   }

   namespace Express {
      interface Request {
         user?: User;
         userId?: number;
         token?: string;
         files?: fileUpload.FileArray | null | undefined
      }
   }
}
