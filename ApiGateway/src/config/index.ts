import dotenv from "dotenv";

dotenv.config();

export const config = {
  port: process.env.PORT || 3000,
  jwtSecret: process.env.JWT_SECRET || "default_secret",
  clientServiceUrl: process.env.CLIENT_SERVICE_URL,
  favoriteServiceUrl: process.env.FAVORITE_SERVICE_URL,
};
