import { v2 as cloudinary } from "cloudinary";
import categoryModel from "../models/categoryModel.js";
import subcategoryModel from "../models/subcategoryModel.js";
import productModel from "../models/productModel.js";

const listCategories = async (req, res) => {
    try {
        const categories = await categoryModel.find({}).sort({ name: 1 }).lean();
        res.json({ success: true, categories });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

const listCategoriesWithSubcategories = async (req, res) => {
    try {
        const categories = await categoryModel.find({}).sort({ name: 1 }).lean();
        const subcategories = await subcategoryModel.find({}).sort({ name: 1 }).lean();
        const subsByCat = {};
        for (const sub of subcategories) {
            const cid = String(sub.categoryId);
            if (!subsByCat[cid]) subsByCat[cid] = [];
            subsByCat[cid].push(sub);
        }
        const categoriesWithSubs = categories.map((c) => ({
            ...c,
            subcategories: subsByCat[String(c._id)] || []
        }));
        res.json({ success: true, categories: categoriesWithSubs });
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
        let imageUrl = null;
        const imageFile = req.file;
        if (imageFile) {
            const result = await cloudinary.uploader.upload(imageFile.path, { resource_type: "image" });
            imageUrl = result.secure_url;
        }
        const category = new categoryModel({ name: name.trim(), image: imageUrl });
        await category.save();
        res.json({ success: true, message: "Category created", category });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

const updateCategory = async (req, res) => {
    try {
        const { id, name } = req.body;
        if (!id) {
            return res.json({ success: false, message: "Category ID is required" });
        }
        const category = await categoryModel.findById(id);
        if (!category) {
            return res.json({ success: false, message: "Category not found" });
        }
        if (name !== undefined && String(name).trim()) {
            const exists = await categoryModel.findOne({ name: name.trim(), _id: { $ne: id } });
            if (exists) {
                return res.json({ success: false, message: "A category with this name already exists" });
            }
            category.name = name.trim();
        }
        const imageFile = req.file;
        if (imageFile) {
            const result = await cloudinary.uploader.upload(imageFile.path, { resource_type: "image" });
            category.image = result.secure_url;
        }
        await category.save();
        res.json({ success: true, message: "Category updated", category });
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

const updateSubcategory = async (req, res) => {
    try {
        const { id, name } = req.body;
        if (!id) {
            return res.json({ success: false, message: "Subcategory ID is required" });
        }
        const subcategory = await subcategoryModel.findById(id);
        if (!subcategory) {
            return res.json({ success: false, message: "Subcategory not found" });
        }
        if (name !== undefined && String(name).trim()) {
            const exists = await subcategoryModel.findOne({
                categoryId: subcategory.categoryId,
                name: name.trim(),
                _id: { $ne: id }
            });
            if (exists) {
                return res.json({ success: false, message: "A subcategory with this name already exists in this category" });
            }
            subcategory.name = name.trim();
        }
        await subcategory.save();
        res.json({ success: true, message: "Subcategory updated", subcategory });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

const deleteCategory = async (req, res) => {
    try {
        const { id } = req.body;
        if (!id) {
            return res.json({ success: false, message: "Category ID is required" });
        }
        const category = await categoryModel.findById(id);
        if (!category) {
            return res.json({ success: false, message: "Category not found" });
        }
        const productsUsing = await productModel.countDocuments({ categoryId: id });
        if (productsUsing > 0) {
            return res.json({ success: false, message: `Cannot delete: ${productsUsing} product(s) use this category. Remove or reassign them first.` });
        }
        const subcatsCount = await subcategoryModel.countDocuments({ categoryId: id });
        if (subcatsCount > 0) {
            return res.json({ success: false, message: `Cannot delete: category has ${subcatsCount} subcategory(ies). Delete them first.` });
        }
        await categoryModel.findByIdAndDelete(id);
        res.json({ success: true, message: "Category deleted" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

const deleteSubcategory = async (req, res) => {
    try {
        const { id } = req.body;
        if (!id) {
            return res.json({ success: false, message: "Subcategory ID is required" });
        }
        const subcategory = await subcategoryModel.findById(id);
        if (!subcategory) {
            return res.json({ success: false, message: "Subcategory not found" });
        }
        const productsUsing = await productModel.countDocuments({ subCategoryId: id });
        if (productsUsing > 0) {
            return res.json({ success: false, message: `Cannot delete: ${productsUsing} product(s) use this subcategory. Reassign or remove them first.` });
        }
        await subcategoryModel.findByIdAndDelete(id);
        res.json({ success: true, message: "Subcategory deleted" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

export { listCategories, listCategoriesWithSubcategories, listSubcategoriesByCategory, createCategory, createSubcategory, updateCategory, updateSubcategory, deleteCategory, deleteSubcategory };
