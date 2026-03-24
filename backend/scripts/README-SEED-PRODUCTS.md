# Bulk Product Seed

Populate the database with products (and images) from a JSON file.

This script ensures **at least 10 products per category** (for categories present in your JSON input). If a category has fewer than 10 provided products, it auto-generates additional variants by duplicating provided items with numbered names.

## Prerequisites

1. **Categories exist** – Run `npm run seed:categories` first.
2. **Cloudinary configured** – Set `CLOUDINARY_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_SECRET_KEY` in `.env`.

## Usage

```bash
# From backend folder:
npm run seed:products

# Or with a custom JSON file:
node scripts/seed-products.js ./my-products.json
```

Default file: `scripts/products-seed.json`

## JSON Format

Create `scripts/products-seed.json` (copy from `products-seed.example.json`):

```json
[
  {
    "name": "Product name",
    "description": "Product description",
    "price": 25,
    "newPrice": 20,
    "category": "Lèvres",
    "subCategory": "Gloss",
    "colors": ["#FF0000", "#0000FF"],
    "inStock": true,
    "bestseller": false,
    "discountTimer": 24,
    "images": ["./seed-data/images/product1.jpg", "https://example.com/image.jpg"]
  }
]
```

### Fields

| Field        | Required | Description                                           |
| ------------ | -------- | ----------------------------------------------------- |
| name         | ✓        | Product name                                          |
| description  | ✓        | Product description                                   |
| price        | ✓        | Price (number)                                        |
| newPrice     |          | Sale price (optional)                                 |
| category     | ✓*       | Category name (e.g. "Lèvres", "Teint") – or categoryId |
| subCategory  |          | Subcategory name (optional)                           |
| colors       | ✓        | Array of hex strings, e.g. `["#FF0000", "#00FF00"]`   |
| inStock      |          | Default: true                                         |
| bestseller   |          | Default: false                                        |
| discountTimer|          | Hours until discount ends (only when newPrice is set) |
| images       | ✓        | Array of image paths or URLs (max 4 used)             |

## Minimum Products Rule

- Per category in your JSON input, the script inserts at least **10 products**.
- If you provide fewer than 10 for a category, it fills the gap automatically (e.g. `Lip Gloss Rose 3`, `Lip Gloss Rose 4`, ...).
- If you provide 10 or more for a category, it inserts all provided products as-is.

### Images

- **Local paths**: Relative to the backend folder, e.g. `./seed-data/images/product1.jpg`
- **URLs**: Full URLs, e.g. `https://example.com/image.jpg`

Images are uploaded to Cloudinary automatically. Create a `seed-data/images/` folder and place your images there, then reference them in the JSON.
