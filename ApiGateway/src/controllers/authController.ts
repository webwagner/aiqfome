import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { config } from "../config";
import { IUser } from "../types/IUser";
import { Roles } from "../types/Roles";

export const login = (req: Request, res: Response): void => {
  const { id, name, roles } = req.body as IUser;

  if (!id || !name || !roles || !Array.isArray(roles) || roles.length === 0) {
    res.status(400).json({
      message: "Id, Nome e Roles são obrigatórios.",
    });
    return;
  }

  const VALID_ROLES: ReadonlyArray<Roles> = ["read", "write"];
  const allRolesValid = roles.every((role) =>
    VALID_ROLES.includes(role as Roles)
  );

  if (!allRolesValid) {
    res.status(400).json({
      message: `Roles inválidas. As roles permitidas são: ${VALID_ROLES.join(
        ", "
      )}.`,
    });
    return;
  }

  const userPayload = {
    id: id,
    name: name,
    roles: roles,
  };

  const token = jwt.sign(userPayload, config.jwtSecret, { expiresIn: "1h" });

  res.json({
    message: "Login efetuado com sucesso.",
    token,
    user: userPayload,
  });
};
