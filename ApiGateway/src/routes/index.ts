import express, { Router } from "express";
import clientRoutes from "./clientRoutes";
import favoriteRoutes from "./favoriteRoutes";
import { login } from "../controllers/authController";

const router = Router();

router.post("/auth/login", express.json(), login);
router.use("/client", clientRoutes);
router.use("/favorite", favoriteRoutes);

export default router;
