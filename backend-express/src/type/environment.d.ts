import { User } from "../model";
import { Secret } from "jsonwebtoken";

export {};

declare global {
    namespace NodeJS {
        interface ProcessEnv {
            PORT: number;
            DB_NAME: string;
            DB_HOST: string;
            DB_USER: string;
            DB_PASSWORD: string;
            DB_PORT: number;

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
        }
    }
}
