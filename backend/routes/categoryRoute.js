import express from "express";
import { listCategories, listSubcategoriesByCategory, createCategory, createSubcategory } from "../controllers/categoryController.js";
import adminAuth from "../middleware/adminAuth.js";

const categoryRouter = express.Router();

categoryRouter.get("/list", listCategories);
categoryRouter.get("/subcategories", listSubcategoriesByCategory);
categoryRouter.post("/subcategories", listSubcategoriesByCategory);

categoryRouter.post("/create", adminAuth, createCategory);
categoryRouter.post("/subcategory/create", adminAuth, createSubcategory);

export default categoryRouter;
