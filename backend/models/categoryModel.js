import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    slug: { type: String, trim: true },
    image: { type: String, trim: true }
}, { timestamps: true });

categorySchema.index({ name: 1 }, { unique: true });

const categoryModel = mongoose.models.category || mongoose.model("category", categorySchema);
export default categoryModel;
