import { Request, Response, NextFunction } from "express";
import * as clientService from "../services/clientService";
import { IClient } from "../types/IClient";

export const createClient = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const clientInput = req.body as IClient;
    if (!clientInput || !clientInput.nome || !clientInput.email) {
      res
        .status(400)
        .json({ message: "Campos nome e email são obrigatórios." });
      return;
    }

    const newClient = await clientService.createClientInService(clientInput);
    res.status(201).json(newClient);
  } catch (error: any) {
    if (error.statusCode === 409) {
      res.status(409).json({ message: error.message });
      return;
    }
    next(error);
  }
};

export const getClientById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const client = await clientService.getClientByIdFromService(id);
    if (client) {
      res.status(200).json(client);
    } else {
      res.status(404).json({ message: "Cliente não encontrado." });
    }
  } catch (error) {
    next(error);
  }
};

export const getAllClients = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const allClients = await clientService.getAllClientsFromService();
    res.status(200).json(allClients);
  } catch (error) {
    next(error);
  }
};

export const updateClient = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const clientUpdate = req.body as Partial<IClient>;

    if (
      Object.keys(clientUpdate).length === 0 ||
      clientUpdate.nome === undefined ||
      clientUpdate.email === undefined
    ) {
      res.status(400).json({
        message: "Nome e email são obrigatórios.",
      });
      return;
    }

    const updatedClient = await clientService.updateClientInService(
      id,
      clientUpdate
    );
    if (updatedClient) {
      res.status(200).json(updatedClient);
    } else {
      res.status(404).json({ message: "Cliente não encontrado." });
    }
  } catch (error: any) {
    if (error.statusCode === 409) {
      res.status(409).json({ message: error.message });
      return;
    }
    next(error);
  }
};

export const deleteClient = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const wasDeleted = await clientService.deleteClientFromService(id);
    if (wasDeleted) {
      res.status(200).json({ message: "Cliente deletado com sucesso." });
    } else {
      res.status(404).json({ message: "Cliente não encontrado." });
    }
  } catch (error) {
    next(error);
  }
};
