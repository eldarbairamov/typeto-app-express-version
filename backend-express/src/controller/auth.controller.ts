import expressAsyncHandler from "express-async-handler";
import { Response } from "express";
import { IRequest } from "../interface/express.interface";
import { IAccessTokenPair, ILogin, IOAuthResponse, IRegistration, IResetPassword } from "../interface/auth.interface";
import { registrationService } from "../service/auth/registration.service";
import { loginService } from "../service/auth/login.service";
import { forgotPasswordService } from "../service/auth/forgot-password.service";
import { resetPasswordService } from "../service/auth/reset-password.service";
import { OAuth } from "../model";
import { ApiException } from "../exception/api.exception";
import { tokenService } from "../service/token.service";
import { REFRESH_TOKEN_TYPE } from "../constant/token-type.constant";

export const authController = {

    registration: expressAsyncHandler(async ( req: IRequest<IRegistration, any, any>, res: Response<{ message: string }> ) => {
        await registrationService(req.body);
        res.status(201).json({ message: "Success" });
    }),

    login: expressAsyncHandler(async ( req: IRequest<ILogin, any, any>, res: Response<IOAuthResponse> ) => {
        const accessTokenPair = await loginService(req.body, req.user!);
        res.status(201).json(accessTokenPair);
    }),

    forgotPassword: expressAsyncHandler(async ( req: IRequest<{ email: string }, any, any>, res: Response<{ message: string }> ) => {
        const clientUrl = req.headers.origin;
        await forgotPasswordService(req.body.email, req.user!, clientUrl!);
        res.json({ message: "Success" });
    }),

    resetPassword: expressAsyncHandler(async ( req: IRequest<IResetPassword, any, any>, res: Response<{ message: string }> ) => {
        await resetPasswordService(req.body);
        res.json({ message: "Success" });
    }),

    logout: expressAsyncHandler(async ( req: IRequest<any, any, any>, res: Response<{ message: string }> ) => {
        await OAuth.destroy({ where: { accessToken: req.token } });
        res.json({ message: "Success" });
    }),

    refresh: expressAsyncHandler(async ( req: IRequest<{ refreshToken: string }, any, any>, res: Response<IAccessTokenPair> ) => {
        const { refreshToken } = req.body;

        if (!refreshToken) throw new ApiException("Token invalid or expired", 401);

        const isTokenExists = await OAuth.findOne({ where: { refreshToken } });
        if (!isTokenExists) throw new ApiException("Token invalid or expired", 401);

        const userId = tokenService.tokenVerify(refreshToken, REFRESH_TOKEN_TYPE);

        const accessTokenPair = tokenService.accessTokenPair(userId);

        await isTokenExists.destroy();
        await OAuth.create({ ownerId: userId, refreshToken: accessTokenPair.refreshToken, accessToken: accessTokenPair.accessToken });

        res.json({ ...accessTokenPair });

    })

};