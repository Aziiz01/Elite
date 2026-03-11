import mongoose from "mongoose";

const favoriteSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "product", required: true },
  },
  { timestamps: true }
);

// Prevent duplicate favorites per user
favoriteSchema.index({ userId: 1, productId: 1 }, { unique: true });
// Efficient lookup: find all users who favorited a product (for price drop notifications)
favoriteSchema.index({ productId: 1 });
// Efficient lookup: find all favorites for a user
favoriteSchema.index({ userId: 1 });

const favoriteModel = mongoose.models.favorite || mongoose.model("favorite", favoriteSchema);

export default favoriteModel;
