import express from "express";
import { createReview, getProductReviews, updateReview, deleteReview } from "../controllers/reviewController.js";
import authUser from "../middleware/auth.js";

const reviewRouter = express.Router();

reviewRouter.post("/create", authUser, createReview);
reviewRouter.post("/product", getProductReviews);
reviewRouter.post("/update", authUser, updateReview);
reviewRouter.post("/delete", authUser, deleteReview);

export default reviewRouter;
