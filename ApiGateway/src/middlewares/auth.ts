import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { config } from "../config";
import { IRequest } from "../types/IRequest";
import { IUser } from "../types/IUser";

export const authenticate = (
  req: IRequest,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(" ")[1];

    if (!token) {
      res.status(401).json({ message: "Token de autenticação não fornecido." });
      return;
    }

    jwt.verify(token, config.jwtSecret, (err: any, user: any) => {
      if (err) {
        if (err.name === "TokenExpiredError") {
          res.status(401).json({ message: "Token expirado." });
          return;
        }
        res.status(403).json({ message: "Token inválido." });
        return;
      }
      req.user = user as IUser;
      next();
    });
  } else {
    res.status(401).json({ message: "Cabeçalho de autorização ausente." });
  }
};
