import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
    {
        rating: { type: Number, required: true, min: 1, max: 5 },
        comment: { type: String, default: "" },
        productId: { type: mongoose.Schema.Types.ObjectId, ref: "product", required: true },
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true }
    },
    { timestamps: true }
);

// One review per user per product
reviewSchema.index({ userId: 1, productId: 1 }, { unique: true });

const reviewModel = mongoose.models.review || mongoose.model("review", reviewSchema);

export default reviewModel;
