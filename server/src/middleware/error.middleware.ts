import { ApiException } from "../exception";
import { NextFunction, Request, Response } from "express";

export const errorMiddleware = ( err: ApiException, req: Request, res: Response, next: NextFunction ) => {
   res.status( err.status || 500 )
       .json( {
          statusCode: err.status || 500,
          message: err.message || "Unknown error"
       } );
};