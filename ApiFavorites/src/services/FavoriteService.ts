import AppDataSource from "../config/dataSource";
import { Favorite } from "../entities/FavoriteEntity";
import { IProduct } from "../types/IProduct";
import { IFavorite } from "../types/IFavorite";
import axios, { AxiosError } from "axios";
import dotenv from "dotenv";

dotenv.config();

const favoriteRepository = AppDataSource.getRepository(Favorite);
const clientServiceUrl = process.env.CLIENT_SERVICE_URL;
const FAKE_STORE_API_PRODUCT_URL = "https://fakestoreapi.com/products";

const doesClientExist = async (clientId: string): Promise<boolean> => {
  if (!clientServiceUrl) {
    console.error("CLIENT_SERVICE_URL não está configurado.");
    throw new Error("Configuração do serviço de cliente ausente.");
  }
  try {
    await axios.get(`${clientServiceUrl}/${clientId}`);
    return true;
  } catch (error: any) {
    if (
      axios.isAxiosError(error) &&
      error.response &&
      error.response.status === 404
    ) {
      console.log(
        `[FavoriteService] Cliente ID: ${clientId} não encontrado (404).`
      );
      return false;
    }
    console.error(
      `[FavoriteService] Erro ao verificar existência do cliente ${clientId}: ${error.message}`
    );
    throw new Error(
      `Não foi possível verificar a existência do cliente ${clientId}.`
    );
  }
};

const getProductDetails = async (
  productId: number
): Promise<IProduct | null> => {
  try {
    const response = await axios.get<IProduct>(
      `${FAKE_STORE_API_PRODUCT_URL}/${productId}`
    );

    if (
      response.data &&
      response.data.id !== undefined &&
      response.data.id.toString() === productId.toString()
    ) {
      return response.data;
    }
    console.warn(
      `[FavoriteService] Produto ID: ${productId} não encontrado na FakeStoreAPI.`
    );
    return null;
  } catch (error: any) {
    const axiosError = error as AxiosError;
    if (
      axiosError.isAxiosError &&
      axiosError.response &&
      axiosError.response.status === 404
    ) {
      console.warn(
        `[FavoriteService] Produto ID: ${productId} retornou 404 da FakeStoreAPI.`
      );
      return null;
    }
    console.error(
      `[FavoriteService] Erro ao buscar produto ${productId} da FakeStoreAPI: ${axiosError.message}`
    );
    const serviceError: any = new Error(
      `Não foi possível obter detalhes do produto ${productId}. Tente novamente mais tarde.`
    );
    serviceError.statusCode = 503;
    throw serviceError;
  }
};

export const createFavoriteInService = async (
  payload: IFavorite
): Promise<Favorite> => {
  const { clientId, productId } = payload;

  const clientExists = await doesClientExist(clientId);
  if (!clientExists) {
    const error: any = new Error(`Cliente com ID ${clientId} não encontrado.`);
    error.statusCode = 404;
    throw error;
  }

  const productDetails = await getProductDetails(productId);
  if (!productDetails) {
    const error: any = new Error(`Produto com ID ${productId} não encontrado.`);
    error.statusCode = 400;
    throw error;
  }

  const existingFavorite = await favoriteRepository.findOneBy({
    clientId,
    productId,
  });
  if (existingFavorite) {
    const error: any = new Error(
      `Este produto (ID: ${productId}) já está nos favoritos do cliente (ID: ${clientId}).`
    );
    error.statusCode = 409;
    throw error;
  }

  const favoriteEntry = favoriteRepository.create({ clientId, productId });
  try {
    await favoriteRepository.save(favoriteEntry);
    return favoriteEntry;
  } catch (error: any) {
    throw error;
  }
};

export const getFavoritesByClientIdFromService = async (
  clientId: string
): Promise<IProduct[]> => {
  const favoriteRecords = await favoriteRepository.find({
    where: { clientId },
  });

  if (!favoriteRecords || favoriteRecords.length === 0) {
    console.log(
      `[FavoriteService] Nenhum registro de favorito encontrado para clientId: ${clientId}`
    );
    return [];
  }

  const productIds = favoriteRecords.map((favRecord) => favRecord.productId);
  if (productIds.length === 0) {
    return [];
  }

  const productDetailPromises = productIds.map((id) => getProductDetails(id));
  const resolvedProductDetails = await Promise.all(productDetailPromises);

  const validProductDetails = resolvedProductDetails.filter(
    (product): product is IProduct => product !== null
  );

  return validProductDetails;
};

export const deleteFavoriteRecordByIdFromService = async (
  favoriteId: string
): Promise<boolean> => {
  const deleteResult = await favoriteRepository.delete(favoriteId);
  const wasDeleted = !!deleteResult.affected && deleteResult.affected > 0;

  return wasDeleted;
};

export const deleteAllFavoritesByClientIdFromService = async (
  clientId: string
): Promise<boolean> => {
  const deleteResult = await favoriteRepository.delete({ clientId });
  return !!deleteResult.affected && deleteResult.affected > 0;
};
