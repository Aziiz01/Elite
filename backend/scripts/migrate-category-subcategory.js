/**
 * Migration: Product category/subcategory strings → Category & Subcategory refs
 *
 * Run with: node scripts/migrate-category-subcategory.js
 *
 * Prerequisites:
 * - MONGODB_URI in .env
 * - Backup your database before running
 *
 * What it does:
 * 1. Creates Category documents from unique product.category values
 * 2. Creates Subcategory documents from unique (category, subCategory) pairs
 * 3. Updates each product to use categoryId and subCategoryId
 * 4. Removes old category and subCategory string fields
 *
 * Run this BEFORE deploying the new product/category code.
 */

import 'dotenv/config'
import mongoose from 'mongoose'

async function migrate() {
    try {
        await mongoose.connect(process.env.MONGODB_URI)
        console.log('Connected to MongoDB')

        const db = mongoose.connection.db
        const productsCol = db.collection('products')
        const categoriesCol = db.collection('categories')
        const subcategoriesCol = db.collection('subcategories')

        const products = await productsCol.find({}).toArray()
        const toMigrate = products.filter(p => p.categoryId == null && p.category != null)
        if (toMigrate.length === 0) {
            console.log('No products to migrate (all already have categoryId or no category string). Run seed-categories.js to create initial categories if needed.')
            return
        }
        console.log(`Migrating ${toMigrate.length} products...`)

        const categoryByName = {}
        const subcategoryByKey = {}

        for (const p of toMigrate) {
            const catName = p.category ? String(p.category).trim() : null
            const subName = p.subCategory ? String(p.subCategory).trim() : null
            if (!catName) continue

            if (!categoryByName[catName]) {
                const inserted = await categoriesCol.insertOne({ name: catName, createdAt: new Date(), updatedAt: new Date() })
                categoryByName[catName] = inserted.insertedId
            }
            const catId = categoryByName[catName]

            if (subName) {
                const key = `${catId}-${subName}`
                if (!subcategoryByKey[key]) {
                    const inserted = await subcategoriesCol.insertOne({
                        name: subName,
                        categoryId: catId,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    })
                    subcategoryByKey[key] = inserted.insertedId
                }
            }
        }

        let updated = 0
        for (const p of toMigrate) {
            const catName = p.category ? String(p.category).trim() : null
            const subName = p.subCategory ? String(p.subCategory).trim() : null

            const catId = catName ? categoryByName[catName] : null
            if (!catId) {
                console.warn(`Skipping product ${p._id}: no valid category`)
                continue
            }

            let subId = null
            if (subName) {
                const key = `${catId}-${subName}`
                subId = subcategoryByKey[key]
            }

            const updateOp = {
                $set: { categoryId: catId },
                $unset: { category: 1, subCategory: 1 }
            }
            if (subId) updateOp.$set.subCategoryId = subId
            else updateOp.$unset.subCategoryId = 1

            await productsCol.updateOne({ _id: p._id }, updateOp)
            updated++
        }

        console.log(`Migration complete. Updated ${updated} products.`)
        console.log(`Categories created: ${Object.keys(categoryByName).length}`)
        console.log(`Subcategories created: ${Object.keys(subcategoryByKey).length}`)
    } catch (err) {
        console.error('Migration failed:', err)
        process.exit(1)
    } finally {
        await mongoose.disconnect()
        process.exit(0)
    }
}

migrate()
