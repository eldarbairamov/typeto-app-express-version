import expressAsyncHandler from "express-async-handler";
import { Response } from "express";
import { OAuth } from "../model";
import { IAccessTokenPair, ILogin, IOAuthResponse, IRegistration, IRequest, IResetPassword } from "../interface";
import { forgotPasswordService, loginService, refreshService, registrationService, resetPasswordService } from "../service";

export const authController = {

   registration: expressAsyncHandler( async ( req: IRequest<IRegistration, any, any>, res: Response<{
      message: string
   }> ) => {
      await registrationService( req.body );
      res.status( 201 ).json( { message: "Success" } );
   } ),

   login: expressAsyncHandler( async ( req: IRequest<ILogin, any, any>, res: Response<IOAuthResponse> ) => {
      const accessTokenPair = await loginService( req.body, req.user! );
      res.status( 201 ).json( accessTokenPair );
   } ),

   forgotPassword: expressAsyncHandler( async ( req: IRequest<{ email: string }, any, any>, res: Response<{
      message: string
   }> ) => {
      const clientUrl = req.headers.origin;
      await forgotPasswordService( req.body.email, req.user!, clientUrl! );
      res.json( { message: "Success" } );
   } ),

   resetPassword: expressAsyncHandler( async ( req: IRequest<IResetPassword, any, any>, res: Response<{
      message: string
   }> ) => {
      await resetPasswordService( req.body );
      res.status( 201 ).json( { message: "Success" } );
   } ),

   logout: expressAsyncHandler( async ( req: IRequest<any, any, any>, res: Response<{ message: string }> ) => {
      await OAuth.destroy( { where: { accessToken: req.token } } );
      res.json( { message: "Success" } );
   } ),

   refresh: expressAsyncHandler( async ( req: IRequest<{
      refreshToken: string
   }, any, any>, res: Response<IAccessTokenPair> ) => {
      const { refreshToken } = req.body;
      const accessTokenPair = await refreshService( refreshToken );
      res.status( 201 ).json( { ...accessTokenPair } );
   } )

};