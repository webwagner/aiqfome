import { Router } from "express";
import * as favoriteController from "../controllers/FavoriteController";

const router = Router();

router.post("/", favoriteController.addFavorite);
router.get("/:clientId", favoriteController.getClientFavorites);
router.delete("/:clientId", favoriteController.deleteClientFavorites);
router.delete("/item/:favoriteId", favoriteController.deleteSpecificFavorite);

export default router;
