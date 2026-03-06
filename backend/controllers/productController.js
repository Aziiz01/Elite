import { v2 as cloudinary } from "cloudinary"
import productModel from "../models/productModel.js"
import reviewModel from "../models/reviewModel.js"

// function for add product
const addProduct = async (req, res) => {
    try {

        const { name, description, price, newPrice, category, subCategory, colors, bestseller, inStock } = req.body

        // Validation
        if (!name || !description || !category || !subCategory) {
            return res.json({ success: false, message: "Name, description, category and subCategory are required" })
        }
        const priceNum = Number(price)
        if (isNaN(priceNum) || priceNum < 0) {
            return res.json({ success: false, message: "Valid price is required" })
        }

        let colorsArray = []
        try {
            colorsArray = typeof colors === 'string' ? JSON.parse(colors) : colors
        } catch {
            return res.json({ success: false, message: "Colors must be a valid JSON array of strings (e.g. [\"Red\",\"Blue\"])" })
        }
        if (!Array.isArray(colorsArray) || colorsArray.length === 0 || !colorsArray.every(c => typeof c === 'string')) {
            return res.json({ success: false, message: "Colors must be a non-empty array of strings" })
        }

        const image1 = req.files?.image1?.[0]
        const image2 = req.files?.image2?.[0]
        const image3 = req.files?.image3?.[0]
        const image4 = req.files?.image4?.[0]

        const images = [image1, image2, image3, image4].filter((item) => item !== undefined)

        if (images.length === 0) {
            return res.json({ success: false, message: "At least one image is required" })
        }

        let imagesUrl = await Promise.all(
            images.map(async (item) => {
                const result = await cloudinary.uploader.upload(item.path, { resource_type: 'image' })
                return result.secure_url
            })
        )

        const newPriceNum = newPrice !== undefined && newPrice !== '' ? Number(newPrice) : undefined
        const hasValidNewPrice = !isNaN(newPriceNum) && newPriceNum >= 0

        const productData = {
            name: name.trim(),
            description: description.trim(),
            category: category.trim(),
            subCategory: subCategory.trim(),
            price: priceNum,
            newPrice: hasValidNewPrice ? newPriceNum : undefined,
            colors: colorsArray.map(c => String(c).trim()),
            inStock: inStock === "false" ? false : true,
            bestseller: bestseller === "true",
            image: imagesUrl,
            date: Date.now()
        }

        const product = new productModel(productData)
        await product.save()

        res.json({ success: true, message: "Product Added" })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// function for list product
const listProducts = async (req, res) => {
    try {
        
        const products = await productModel.find({})
        const productsWithDisplayPrice = products.map(p => {
            const obj = p.toObject()
            obj.displayPrice = p.newPrice ?? p.price
            return obj
        })
        res.json({ success: true, products: productsWithDisplayPrice })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// function for removing product
const removeProduct = async (req, res) => {
    try {
        
        await productModel.findByIdAndDelete(req.body.id)
        res.json({success:true,message:"Product Removed"})

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// function for single product info
const singleProduct = async (req, res) => {
    try {
        
        const { productId } = req.body
        const product = await productModel.findById(productId)
        if (!product) {
            return res.json({ success: false, message: "Product not found" })
        }

        const reviews = await reviewModel
            .find({ productId })
            .populate("userId", "firstName lastName")
            .sort({ createdAt: -1 })
            .lean()

        const productObj = product.toObject()
        productObj.displayPrice = product.newPrice ?? product.price
        productObj.reviews = reviews
        res.json({ success: true, product: productObj })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// function for update product
const updateProduct = async (req, res) => {
    try {
        const { id, name, description, price, newPrice, category, subCategory, colors, bestseller, inStock } = req.body

        if (!id) {
            return res.json({ success: false, message: "Product ID is required" })
        }
        const product = await productModel.findById(id)
        if (!product) {
            return res.json({ success: false, message: "Product not found" })
        }

        if (!name || !description || !category || !subCategory) {
            return res.json({ success: false, message: "Name, description, category and subCategory are required" })
        }
        const priceNum = Number(price)
        if (isNaN(priceNum) || priceNum < 0) {
            return res.json({ success: false, message: "Valid price is required" })
        }

        let colorsArray = []
        try {
            colorsArray = typeof colors === 'string' ? JSON.parse(colors) : (colors || [])
        } catch {
            return res.json({ success: false, message: "Colors must be a valid JSON array" })
        }
        if (!Array.isArray(colorsArray) || colorsArray.length === 0 || !colorsArray.every(c => typeof c === 'string')) {
            return res.json({ success: false, message: "Colors must be a non-empty array of strings" })
        }

        const newPriceNum = newPrice !== undefined && newPrice !== '' ? Number(newPrice) : undefined
        const hasValidNewPrice = newPriceNum !== undefined && !isNaN(newPriceNum) && newPriceNum >= 0

        let imagesUrl = [...(product.image || [])]
        const image1 = req.files?.image1?.[0]
        const image2 = req.files?.image2?.[0]
        const image3 = req.files?.image3?.[0]
        const image4 = req.files?.image4?.[0]

        if (image1) {
            const result = await cloudinary.uploader.upload(image1.path, { resource_type: 'image' })
            imagesUrl[0] = result.secure_url
        }
        if (image2) {
            const result = await cloudinary.uploader.upload(image2.path, { resource_type: 'image' })
            imagesUrl[1] = result.secure_url
        }
        if (image3) {
            const result = await cloudinary.uploader.upload(image3.path, { resource_type: 'image' })
            imagesUrl[2] = result.secure_url
        }
        if (image4) {
            const result = await cloudinary.uploader.upload(image4.path, { resource_type: 'image' })
            imagesUrl[3] = result.secure_url
        }

        if (imagesUrl.filter(Boolean).length === 0) {
            return res.json({ success: false, message: "At least one image is required" })
        }

        product.name = name.trim()
        product.description = description.trim()
        product.category = category.trim()
        product.subCategory = subCategory.trim()
        product.price = priceNum
        product.newPrice = hasValidNewPrice ? newPriceNum : undefined
        product.colors = colorsArray.map(c => String(c).trim())
        product.inStock = inStock === "false" ? false : true
        product.bestseller = bestseller === "true"
        product.image = imagesUrl.filter(Boolean)
        await product.save()

        res.json({ success: true, message: "Product updated" })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

export { listProducts, addProduct, removeProduct, singleProduct, updateProduct }