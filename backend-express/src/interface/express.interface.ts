import { Request } from "express";
import { User } from "../model";
import fileUpload from "express-fileupload";

export interface IRequest<B, P, Q> extends Request<P, {}, B, Q> {
   body: B;
   params: P;
   query: Q;
   user?: User;
   token?: string;
   userId?: number;
   files?: fileUpload.FileArray | null | undefined;
}