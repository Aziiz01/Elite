import userModel from "../models/userModel.js"


// add products to user cart
const addToCart = async (req,res) => {
    try {
        
        const { userId, itemId, color } = req.body

        if (!itemId || !color) {
            return res.json({ success: false, message: "itemId and color are required" })
        }

        const userData = await userModel.findById(userId)
        let cartData = userData.cartData || {}

        if (cartData[itemId]) {
            if (cartData[itemId][color]) {
                cartData[itemId][color] += 1
            } else {
                cartData[itemId][color] = 1
            }
        } else {
            cartData[itemId] = {}
            cartData[itemId][color] = 1
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

export { addToCart, updateCart, getUserCart }