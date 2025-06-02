import { Request } from "express";
import { IUser } from "../types/IUser";

export interface IRequest extends Request {
  user?: IUser;
}
