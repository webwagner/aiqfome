import { Roles } from "../types/Roles";

export interface IUser {
  id: number;
  name: string;
  roles: Roles[];
}
