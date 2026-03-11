import express from "express";
import { listCategories, listCategoriesWithSubcategories, listSubcategoriesByCategory, createCategory, createSubcategory, updateCategory, updateSubcategory, deleteCategory, deleteSubcategory } from "../controllers/categoryController.js";
import adminAuth from "../middleware/adminAuth.js";
import upload from "../middleware/multer.js";

const categoryRouter = express.Router();

categoryRouter.get("/list", listCategories);
categoryRouter.get("/list-with-subs", listCategoriesWithSubcategories);
categoryRouter.get("/subcategories", listSubcategoriesByCategory);
categoryRouter.post("/subcategories", listSubcategoriesByCategory);

categoryRouter.post("/create", adminAuth, upload.single("image"), createCategory);
categoryRouter.post("/update", adminAuth, upload.single("image"), updateCategory);
categoryRouter.post("/delete", adminAuth, deleteCategory);
categoryRouter.post("/subcategory/create", adminAuth, createSubcategory);
categoryRouter.post("/subcategory/update", adminAuth, updateSubcategory);
categoryRouter.post("/subcategory/delete", adminAuth, deleteSubcategory);

export default categoryRouter;
