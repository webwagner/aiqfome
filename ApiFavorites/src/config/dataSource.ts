import "reflect-metadata";
import { DataSource, DataSourceOptions } from "typeorm";
import dotenv from "dotenv";
import { Favorite } from "../entities/FavoriteEntity";

dotenv.config();

export const dataSourceOptions: DataSourceOptions = {
  type: "postgres",
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT || "5432", 10),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  synchronize: false,
  logging:
    process.env.NODE_ENV === "development" ? ["query", "error"] : ["error"],
  entities: [Favorite],
  migrations: ["src/migrations/**/*{.ts,.js}"],
  subscribers: [],
};

const AppDataSource = new DataSource(dataSourceOptions);

export default AppDataSource;
