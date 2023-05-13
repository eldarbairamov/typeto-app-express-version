import { Request } from "express";
import { User } from "../model";

export interface IRequest<B, P, Q> extends Request<P, {}, B, Q> {
   body: B;
   params: P;
   query: Q;
   user?: User;
   token?: string;
   userId?: number;
}