import express, { Application, Request, Response, NextFunction } from "express";
import { config } from "./config";
import routes from "./routes";
import rateLimit from "express-rate-limit";
import swaggerUi from "swagger-ui-express";
import swaggerOptions from "./config/swaggerConfig";

const app: Application = express();
const PORT = config.port;
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 1000,
  message: "Limite de 1000 requests por minuto.",
});

app.use(limiter);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerOptions));
app.use("/api", routes);
app.use(limiter);

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  const statusCode = err.statusCode || 500;
  const message = err.message || "Erro no servidor.";
  res.status(statusCode).json({ message });
});

app.listen(PORT);

export default app;
