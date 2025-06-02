import { Request, Response, NextFunction } from "express";
import { IFavorite } from "../types/IFavorite";
import * as favoriteService from "../services/FavoriteService";

export const addFavorite = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { clientId, productId } = req.body as IFavorite;

    if (productId === undefined || !clientId) {
      res.status(400).json({
        message: 'Os campos "clientId" e "productId" são obrigatórios.',
      });
      return;
    }
    if (typeof productId !== "number") {
      res.status(400).json({ message: "productId deve ser um número." });
      return;
    }
    if (typeof clientId !== "string") {
      res.status(400).json({ message: "clientId deve ser uma string." });
      return;
    }

    const payload: IFavorite = { clientId, productId };
    const newFavoriteRecord = await favoriteService.createFavoriteInService(
      payload
    );

    res.status(201).json({
      message: "Produto adicionado aos favoritos com sucesso.",
      favoriteId: newFavoriteRecord.id,
      clientId: newFavoriteRecord.clientId,
      productId: newFavoriteRecord.productId,
    });
  } catch (error: any) {
    next(error);
  }
};

export const getClientFavorites = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { clientId } = req.params;
    if (!clientId) {
      res
        .status(400)
        .json({ message: 'O parâmetro "clientId" é obrigatório.' });
      return;
    }

    const productsDetails =
      await favoriteService.getFavoritesByClientIdFromService(clientId);
    res.status(200).json(productsDetails);
  } catch (error: any) {
    next(error);
  }
};

export const deleteClientFavorites = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { clientId } = req.params;
    if (!clientId) {
      res
        .status(400)
        .json({ message: 'O parâmetro "clientId" é obrigatório.' });
      return;
    }
    const affectedCount =
      await favoriteService.deleteAllFavoritesByClientIdFromService(clientId);
    if (affectedCount) {
      res.status(200).json({
        message: `Favorito(s) do cliente ${clientId} foram deletados.`,
      });
    } else {
      res.status(200).json({
        message: `Nenhum favorito encontrado para deletar para o cliente ${clientId}.`,
      });
    }
  } catch (error: any) {
    next(error);
  }
};

export const deleteSpecificFavorite = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { favoriteId } = req.params;
    if (!favoriteId) {
      res
        .status(400)
        .json({ message: 'O parâmetro "favoriteId" é obrigatório.' });
      return;
    }
    const wasDeleted =
      await favoriteService.deleteFavoriteRecordByIdFromService(favoriteId);
    if (wasDeleted) {
      res.status(200).json({
        message: `Favorito com ID ${favoriteId} deletado com sucesso.`,
      });
    } else {
      res.status(404).json({
        message: `Registro de favorito com ID ${favoriteId} não encontrado.`,
      });
    }
  } catch (error: any) {
    next(error);
  }
};
