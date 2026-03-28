/**
 * Migration script: Product schema
 *
 * Run with: node scripts/migrate-product-schema.js
 *
 * Prerequisites:
 * - MONGODB_URI in .env
 * - Backup your database before running
 *
 * What it does:
 * - Adds colors (copied from sizes, or ["Default"] if sizes missing)
 * - Adds inStock: true
 * - Adds productAttributes object
 * - Removes sizes field
 *
 * Note: Cart uses productId[color]=quantity. If you had cartData with size keys,
 * you need to update the frontend to use color and clear old carts, or run a
 * separate cart migration.
 */

import 'dotenv/config'
import mongoose from 'mongoose'

async function migrate() {
    try {
        await mongoose.connect(process.env.MONGODB_URI)
        console.log('Connected to MongoDB')

        const db = mongoose.connection.db
        const collection = db.collection('products')
        const defaultProductAttributes = {
            releaseDate: '',
            brand: '',
            range: '',
            productType: '',
            classification: '',
            content: '',
            country: '',
            collection: '',
            manufacturer: '',
            precautions: '',
            usageTips: '',
            ingredients: '',
        }

        const products = await collection.find({}).toArray()
        let updated = 0

        for (const product of products) {
            const hasSizes = product.sizes !== undefined && product.sizes !== null
            const hasColors = product.colors !== undefined && Array.isArray(product.colors) && product.colors.length > 0
            const hasInStock = product.inStock !== undefined
            const hasAttributes = product.productAttributes && typeof product.productAttributes === 'object'

            if (!hasColors || !hasInStock || hasSizes || !hasAttributes) {
                const colors = hasColors
                    ? product.colors
                    : (hasSizes && Array.isArray(product.sizes))
                        ? product.sizes.map(s => String(s))
                        : ['Default']

                const updateOp = {
                    $set: {
                        colors,
                        inStock: hasInStock ? product.inStock : true,
                        productAttributes: hasAttributes ? {
                            ...defaultProductAttributes,
                            ...product.productAttributes,
                        } : defaultProductAttributes,
                    }
                }
                if (hasSizes) updateOp.$unset = { sizes: 1 }
                await collection.updateOne({ _id: product._id }, updateOp)
                updated++
            }
        }

        console.log(`Migration complete. Updated ${updated} products.`)
    } catch (err) {
        console.error('Migration failed:', err)
        process.exit(1)
    } finally {
        await mongoose.disconnect()
        process.exit(0)
    }
}

migrate()
