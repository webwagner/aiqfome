import AppDataSource from "../config/dataSource";
import { Client } from "../entities/ClientEntity";
import { IClient } from "../types/IClient";
import { Not } from "typeorm";

const clientRepository = AppDataSource.getRepository(Client);

export const createClientInService = async (
  clientInput: IClient
): Promise<Client> => {
  const { nome, email } = clientInput;

  const existingClientByEmail = await clientRepository.findOneBy({
    email: email,
  });
  if (existingClientByEmail) {
    const conflictError: any = new Error("O e-mail já está em uso.");
    conflictError.statusCode = 409;
    throw conflictError;
  }

  const client = clientRepository.create({ nome, email });
  await clientRepository.save(client);
  return client;
};

export const getClientByIdFromService = async (
  id: string
): Promise<Client | null> => {
  return clientRepository.findOneBy({ id });
};

export const getAllClientsFromService = async (): Promise<Client[]> => {
  return clientRepository.find({ order: { nome: "ASC" } });
};

export const updateClientInService = async (
  id: string,
  clientUpdate: Partial<IClient>
): Promise<Client | null> => {
  const clientToUpdate = await clientRepository.findOneBy({ id });
  if (!clientToUpdate) {
    return null;
  }

  if (clientUpdate.email && clientUpdate.email !== clientToUpdate.email) {
    const existingClientWithNewEmail = await clientRepository.findOne({
      where: {
        email: clientUpdate.email,
        id: Not(id),
      },
    });
    if (existingClientWithNewEmail) {
      const conflictError: any = new Error("O e-mail já está em uso.");
      conflictError.statusCode = 409;
      throw conflictError;
    }
  }

  if (clientUpdate.nome !== undefined) {
    clientToUpdate.nome = clientUpdate.nome;
  }
  if (clientUpdate.email !== undefined) {
    clientToUpdate.email = clientUpdate.email;
  }
  await clientRepository.save(clientToUpdate);
  return clientToUpdate;
};

export const deleteClientFromService = async (id: string): Promise<boolean> => {
  const deleteResult = await clientRepository.delete(id);
  return !!deleteResult.affected && deleteResult.affected > 0;
};
