import userModel from "../models/userModel.js";
import productModel from "../models/productModel.js";

// add products to user cart
const addToCart = async (req,res) => {
    try {
        
        const { userId, itemId, color, quantity: qty } = req.body
        const addQty = Math.max(1, Number(qty) || 1)

        if (!itemId || !color) {
            return res.json({ success: false, message: "itemId and color are required" })
        }

        const product = await productModel.findById(itemId).lean();
        if (!product) {
            return res.json({ success: false, message: "Product not found" });
        }
        if (!product.inStock) {
            return res.json({ success: false, message: "Product is out of stock" });
        }
        const validColors = Array.isArray(product.colors) ? product.colors : [];
        if (!validColors.includes(color)) {
            return res.json({ success: false, message: `Invalid color. Available: ${validColors.join(", ")}` });
        }

        const userData = await userModel.findById(userId)
        let cartData = userData.cartData || {}

        if (cartData[itemId]) {
            if (cartData[itemId][color]) {
                cartData[itemId][color] += addQty
            } else {
                cartData[itemId][color] = addQty
            }
        } else {
            cartData[itemId] = {}
            cartData[itemId][color] = addQty
        }

        await userModel.findByIdAndUpdate(userId, { cartData })

        res.json({ success: true, message: "Added To Cart" })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// update user cart
const updateCart = async (req,res) => {
    try {
        
        const { userId, itemId, color, quantity } = req.body

        if (!itemId || !color || quantity === undefined) {
            return res.json({ success: false, message: "itemId, color and quantity are required" })
        }

        const userData = await userModel.findById(userId)
        const cartData = userData.cartData || {}

        if (!cartData[itemId] || !cartData[itemId][color]) {
            return res.json({ success: false, message: "Cart item not found" })
        }

        const newQty = Number(quantity);
        if (newQty > 0) {
            const product = await productModel.findById(itemId).lean();
            if (!product) {
                return res.json({ success: false, message: "Product no longer available" });
            }
            if (!product.inStock) {
                return res.json({ success: false, message: "Product is out of stock" });
            }
            const validColors = Array.isArray(product.colors) ? product.colors : [];
            if (!validColors.includes(color)) {
                return res.json({ success: false, message: "Invalid color for this product" });
            }
        }

        if (Number(quantity) <= 0) {
            delete cartData[itemId][color]
            if (Object.keys(cartData[itemId]).length === 0) {
                delete cartData[itemId]
            }
        } else {
            cartData[itemId][color] = Number(quantity)
        }

        await userModel.findByIdAndUpdate(userId, { cartData })
        res.json({ success: true, message: "Cart Updated" })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}


// get user cart data
const getUserCart = async (req,res) => {

    try {
        
        const { userId } = req.body
        
        const userData = await userModel.findById(userId)
        const cartData = userData.cartData || {}

        res.json({ success: true, cartData })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }

}

// merge guest cart into user cart (on login)
const mergeCart = async (req, res) => {
    try {
        const { userId, cartData: guestCart } = req.body;

        if (!userId) {
            return res.json({ success: false, message: "userId is required" });
        }
        if (!guestCart || typeof guestCart !== "object") {
            return res.json({ success: true, cartData: {} });
        }

        const userData = await userModel.findById(userId);
        let cartData = userData.cartData || {};

        for (const [itemId, colorMap] of Object.entries(guestCart)) {
            if (!colorMap || typeof colorMap !== "object") continue;

            const product = await productModel.findById(itemId).lean();
            if (!product || !product.inStock) continue;
            const validColors = Array.isArray(product.colors) ? product.colors : [];

            for (const [color, qty] of Object.entries(colorMap)) {
                const addQty = Math.max(0, Number(qty) || 0);
                if (addQty <= 0 || !validColors.includes(color)) continue;

                if (cartData[itemId]) {
                    cartData[itemId][color] = (cartData[itemId][color] || 0) + addQty;
                } else {
                    cartData[itemId] = { [color]: addQty };
                }
            }
        }

        await userModel.findByIdAndUpdate(userId, { cartData });
        res.json({ success: true, cartData });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

export { addToCart, updateCart, getUserCart, mergeCart }