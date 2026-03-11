import favoriteModel from "../models/favoriteModel.js";
import productModel from "../models/productModel.js";

const addFavorite = async (req, res) => {
  try {
    const { userId, productId } = req.body;

    if (!productId) {
      return res.json({ success: false, message: "Product ID is required" });
    }

    const product = await productModel.findById(productId);
    if (!product) {
      return res.json({ success: false, message: "Product not found" });
    }

    const existing = await favoriteModel.findOne({ userId, productId });
    if (existing) {
      return res.json({ success: true, message: "Already in favorites", favorite: existing });
    }

    const favorite = new favoriteModel({ userId, productId });
    await favorite.save();

    res.json({ success: true, message: "Added to favorites", favorite });
  } catch (error) {
    if (error.code === 11000) {
      return res.json({ success: true, message: "Already in favorites" });
    }
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const removeFavorite = async (req, res) => {
  try {
    const { userId, productId } = req.body;

    if (!productId) {
      return res.json({ success: false, message: "Product ID is required" });
    }

    await favoriteModel.findOneAndDelete({ userId, productId });

    res.json({ success: true, message: "Removed from favorites" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const getFavorites = async (req, res) => {
  try {
    const { userId } = req.body;

    const favorites = await favoriteModel
      .find({ userId })
      .populate({
        path: "productId",
        select: "name image price newPrice _id",
      })
      .sort({ createdAt: -1 })
      .lean();

    const items = favorites
      .filter((f) => f.productId)
      .map((f) => ({
        _id: f._id,
        productId: f.productId._id,
        name: f.productId.name,
        image: f.productId.image,
        price: f.productId.price,
        newPrice: f.productId.newPrice,
      }));

    res.json({ success: true, favorites: items });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const checkFavorite = async (req, res) => {
  try {
    const { userId, productId } = req.body;

    if (!productId) {
      return res.json({ success: false, message: "Product ID is required", isFavorited: false });
    }

    const favorite = await favoriteModel.findOne({ userId, productId });
    res.json({ success: true, isFavorited: !!favorite });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message, isFavorited: false });
  }
};

export { addFavorite, removeFavorite, getFavorites, checkFavorite };
