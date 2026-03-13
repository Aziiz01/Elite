# Elite — Full-Stack Ecommerce Platform

A modern, full-stack ecommerce application built with React, Node.js, and MongoDB. The platform consists of three applications: a customer-facing storefront, an admin dashboard for product and order management, and a REST API backend.

## Project Structure

```
├── frontend/     # Customer storefront (React + Vite)
├── admin/        # Admin dashboard for managing products, orders & users
└── backend/      # Express.js API server
```

## Features

### Storefront (Frontend)
- **Product Catalog** — Browse products by category (Lèvres, Teint, Yeux) and subcategory
- **Product Details** — View product info, images, colors, and customer reviews
- **Shopping Cart** — Add/remove items, update quantities with cart modal
- **User Authentication** — Register, login, and guest checkout
- **Checkout** — Place orders with Cash on Delivery (COD)
- **Order Tracking** — View order history and status
- **Reviews & Ratings** — Leave and view product reviews
- **Responsive Design** — Mobile-friendly UI with Tailwind CSS

### Admin Dashboard
- **Product Management** — Add, edit, and list products with image uploads
- **Order Management** — View and manage customer orders
- **User Management** — View registered users
- **Secure Access** — JWT-based admin authentication

### Backend API
- **RESTful API** — User, product, cart, order, and review endpoints
- **Authentication** — JWT with bcrypt password hashing
- **File Upload** — Cloudinary for product images
- **Database** — MongoDB with Mongoose ODM
- **Notifications** — Email (Nodemailer) and SMS (Vonage) for order confirmations and status updates
- **Deployment Ready** — Vercel serverless support

## Tech Stack

| Layer      | Technologies                          |
| ---------- | ------------------------------------- |
| Frontend   | React 18, Vite, Tailwind CSS, Axios   |
| Admin      | React 18, Vite, Tailwind CSS          |
| Backend    | Node.js, Express, Mongoose            |
| Database   | MongoDB                                |
| Storage    | Cloudinary (images)                   |
| Payments   | Cash on Delivery (COD)                |
| Auth       | JWT, bcrypt                           |

## Getting Started

### Prerequisites

- Node.js (v18+)
- MongoDB database
- Cloudinary account (for image uploads)
- Vonage & SMTP credentials (optional, for SMS/email)

### Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in `backend/` (see `backend/.env.example`):

```env
# Required
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_at_least_32_chars
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=your_admin_password

# Optional
PORT=4000
CLOUDINARY_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_SECRET_KEY=your_api_secret
# Or use: CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_SECRET (aliases supported)

# Email (SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email
SMTP_PASS=your_app_password
# Or use: MAIL_HOST, MAIL_USER, MAIL_PASS (aliases supported)

# SMS (Vonage)
VONAGE_API_KEY=
VONAGE_API_SECRET=

# CORS (comma-separated origins; defaults to localhost:5173,5174 if unset)
# CORS_ORIGINS=https://your-store.com
```

Start the server:

```bash
npm run server
```

### Frontend Setup

```bash
cd frontend
npm install
```

Create `.env` in `frontend/`:

```env
VITE_BACKEND_URL=http://localhost:4000
```

Start the dev server:

```bash
npm run dev
```

### Admin Setup

```bash
cd admin
npm install
```

Create `.env` in `admin/`:

```env
VITE_BACKEND_URL=http://localhost:4000
```

Start the dev server:

```bash
npm run dev
```

## API Endpoints

| Method | Endpoint              | Description                |
| ------ | --------------------- | -------------------------- |
| POST   | /api/user/register    | Register new user          |
| POST   | /api/user/login       | User login                 |
| POST   | /api/user/profile     | Get user profile (auth)    |
| GET    | /api/product/list     | List all products          |
| POST   | /api/cart/add         | Add to cart (auth)         |
| POST   | /api/cart/update      | Update cart (auth)         |
| POST   | /api/cart/get         | Get cart (auth)            |
| POST   | /api/order/place      | Place order (auth)         |
| POST   | /api/order/place-guest| Place order (guest)        |
| POST   | /api/review/product   | Get product reviews        |
| POST   | /api/review/create    | Create review (auth)       |

## License

Mohamed Aziz Nacib
