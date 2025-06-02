import express, { Application, Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import clientApiRoutes from "./routes/index";
import AppDataSource from "./config/dataSource";

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use("/", clientApiRoutes);

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(
    `[ClientService Error Handler] Path: ${req.path}, Error: ${
      err.stack || err.message || err
    }`
  );
  const statusCode = err.statusCode || 500;
  const message = err.message || "Erro Interno no Serviço de Favoritos";
  if (!res.headersSent) {
    res.status(statusCode).json({ message, service: "Favorites Service" });
  }
});

AppDataSource.initialize()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Serviço Favorites rodando na porta ${PORT}`);
      console.log(`Ambiente: ${process.env.NODE_ENV}`);
    });
  })
  .catch((error) => {
    console.error("Erro ao tentar acessar o database.", error);
    process.exit(1);
  });

export default app;
