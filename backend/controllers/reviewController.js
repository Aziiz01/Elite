import reviewModel from "../models/reviewModel.js";
import productModel from "../models/productModel.js";

// Create review (user can review a product only once)
const createReview = async (req, res) => {
    try {
        const { userId, productId, rating, comment } = req.body;

        if (!productId || !rating) {
            return res.json({ success: false, message: "Product ID and rating are required" });
        }

        const ratingNum = Number(rating);
        if (isNaN(ratingNum) || ratingNum < 1 || ratingNum > 5) {
            return res.json({ success: false, message: "Rating must be between 1 and 5" });
        }

        const product = await productModel.findById(productId);
        if (!product) {
            return res.json({ success: false, message: "Product not found" });
        }

        const existingReview = await reviewModel.findOne({ userId, productId });
        if (existingReview) {
            return res.json({ success: false, message: "You have already reviewed this product" });
        }

        const review = new reviewModel({
            userId,
            productId,
            rating: ratingNum,
            comment: comment ? String(comment).trim() : ""
        });
        await review.save();
        await review.populate("userId", "firstName lastName");

        res.json({ success: true, message: "Review added", review });
    } catch (error) {
        if (error.code === 11000) {
            return res.json({ success: false, message: "You have already reviewed this product" });
        }
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// Get reviews for a product
const getProductReviews = async (req, res) => {
    try {
        const { productId } = req.body;

        if (!productId) {
            return res.json({ success: false, message: "Product ID is required" });
        }

        const reviews = await reviewModel
            .find({ productId })
            .populate("userId", "firstName lastName")
            .sort({ createdAt: -1 })
            .lean();

        res.json({ success: true, reviews });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// Update own review
const updateReview = async (req, res) => {
    try {
        const { userId, reviewId, rating, comment } = req.body;

        if (!reviewId) {
            return res.json({ success: false, message: "Review ID is required" });
        }

        const review = await reviewModel.findById(reviewId);
        if (!review) {
            return res.json({ success: false, message: "Review not found" });
        }

        if (review.userId.toString() !== userId) {
            return res.json({ success: false, message: "Not authorized to update this review" });
        }

        if (rating !== undefined) {
            const ratingNum = Number(rating);
            if (isNaN(ratingNum) || ratingNum < 1 || ratingNum > 5) {
                return res.json({ success: false, message: "Rating must be between 1 and 5" });
            }
            review.rating = ratingNum;
        }
        if (comment !== undefined) review.comment = String(comment).trim();

        await review.save();
        await review.populate("userId", "firstName lastName");

        res.json({ success: true, message: "Review updated", review });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// Delete own review
const deleteReview = async (req, res) => {
    try {
        const { userId, reviewId } = req.body;

        if (!reviewId) {
            return res.json({ success: false, message: "Review ID is required" });
        }

        const review = await reviewModel.findById(reviewId);
        if (!review) {
            return res.json({ success: false, message: "Review not found" });
        }

        if (review.userId.toString() !== userId) {
            return res.json({ success: false, message: "Not authorized to delete this review" });
        }

        await reviewModel.findByIdAndDelete(reviewId);
        res.json({ success: true, message: "Review deleted" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

export { createReview, getProductReviews, updateReview, deleteReview };
