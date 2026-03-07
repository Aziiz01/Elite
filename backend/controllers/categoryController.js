import categoryModel from "../models/categoryModel.js";
import subcategoryModel from "../models/subcategoryModel.js";

const listCategories = async (req, res) => {
    try {
        const categories = await categoryModel.find({}).sort({ name: 1 }).lean();
        res.json({ success: true, categories });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

const listSubcategoriesByCategory = async (req, res) => {
    try {
        const categoryId = req.body?.categoryId || req.query?.categoryId;
        if (!categoryId) {
            return res.json({ success: false, message: "Category ID is required" });
        }
        const subcategories = await subcategoryModel.find({ categoryId }).sort({ name: 1 }).lean();
        res.json({ success: true, subcategories });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

const createCategory = async (req, res) => {
    try {
        const { name } = req.body;
        if (!name || !String(name).trim()) {
            return res.json({ success: false, message: "Name is required" });
        }
        const exists = await categoryModel.findOne({ name: name.trim() });
        if (exists) {
            return res.json({ success: false, message: "Category already exists" });
        }
        const category = new categoryModel({ name: name.trim() });
        await category.save();
        res.json({ success: true, message: "Category created", category });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

const createSubcategory = async (req, res) => {
    try {
        const { name, categoryId } = req.body;
        if (!name || !String(name).trim()) {
            return res.json({ success: false, message: "Name is required" });
        }
        if (!categoryId) {
            return res.json({ success: false, message: "Category ID is required" });
        }
        const category = await categoryModel.findById(categoryId);
        if (!category) {
            return res.json({ success: false, message: "Category not found" });
        }
        const exists = await subcategoryModel.findOne({ categoryId, name: name.trim() });
        if (exists) {
            return res.json({ success: false, message: "Subcategory already exists for this category" });
        }
        const subcategory = new subcategoryModel({ name: name.trim(), categoryId });
        await subcategory.save();
        res.json({ success: true, message: "Subcategory created", subcategory });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

export { listCategories, listSubcategoriesByCategory, createCategory, createSubcategory };
