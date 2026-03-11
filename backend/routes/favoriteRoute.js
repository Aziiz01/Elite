import express from "express";
import { addFavorite, removeFavorite, getFavorites, checkFavorite } from "../controllers/favoriteController.js";
import authUser from "../middleware/auth.js";

const favoriteRouter = express.Router();

favoriteRouter.post("/add", authUser, addFavorite);
favoriteRouter.post("/remove", authUser, removeFavorite);
favoriteRouter.post("/list", authUser, getFavorites);
favoriteRouter.post("/check", authUser, checkFavorite);

export default favoriteRouter;
