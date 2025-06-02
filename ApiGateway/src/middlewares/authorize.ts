import { Response, NextFunction } from "express";
import { IRequest } from "../types/IRequest";
import { Roles } from "../types/Roles";

export const authorize = (allowedRoles: Roles[]) => {
  return (req: IRequest, res: Response, next: NextFunction): void => {
    if (!req.user || !req.user.roles) {
      res.status(403).json({
        message: "Acesso negado. Roles não encontradas para o usuário.",
      });
      return;
    }

    const hasRole = req.user.roles.some((role) => allowedRoles.includes(role));
    if (!hasRole) {
      res.status(403).json({
        message: `Acesso negado. Requer uma das seguintes roles: ${allowedRoles.join(
          ", "
        )}`,
      });
      return;
    }

    next();
  };
};
