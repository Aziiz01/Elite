/**
 * Seed script: Create initial categories and subcategories
 *
 * Run with: node scripts/seed-categories.js
 *
 * Use when:
 * - Database is empty (no categories/subcategories)
 * - You want to add default Men/Women/Kids + Topwear/Bottomwear/Winterwear
 *
 * Safe to run multiple times (upserts by name).
 */

import 'dotenv/config'
import mongoose from 'mongoose'
import categoryModel from '../models/categoryModel.js'
import subcategoryModel from '../models/subcategoryModel.js'

const DEFAULT_DATA = [
    { category: 'Men', subcategories: ['Topwear', 'Bottomwear', 'Winterwear'] },
    { category: 'Women', subcategories: ['Topwear', 'Bottomwear', 'Winterwear'] },
    { category: 'Kids', subcategories: ['Topwear', 'Bottomwear', 'Winterwear'] },
    { category: 'Lèvres', subcategories: ['Gloss', 'Rouge à lèvres'] },
    { category: 'Teint', subcategories: ['Poudres', 'Fond de teint'] },
    { category: 'Yeux', subcategories: ['Eye Liner', 'Fard à paupières'] }
]

async function seed() {
    try {
        await mongoose.connect(process.env.MONGODB_URI)
        console.log('Connected to MongoDB')

        let catsCreated = 0
        let subsCreated = 0

        for (const { category: catName, subcategories } of DEFAULT_DATA) {
            let cat = await categoryModel.findOne({ name: catName })
            if (!cat) {
                cat = await categoryModel.create({ name: catName })
                catsCreated++
                console.log(`Created category: ${catName}`)
            }

            for (const subName of subcategories) {
                const exists = await subcategoryModel.findOne({ categoryId: cat._id, name: subName })
                if (!exists) {
                    await subcategoryModel.create({ name: subName, categoryId: cat._id })
                    subsCreated++
                    console.log(`  Created subcategory: ${subName} (${catName})`)
                }
            }
        }

        console.log(`Seed complete. Categories: ${catsCreated} new, Subcategories: ${subsCreated} new.`)
    } catch (err) {
        console.error('Seed failed:', err)
        process.exit(1)
    } finally {
        await mongoose.disconnect()
        process.exit(0)
    }
}

seed()
