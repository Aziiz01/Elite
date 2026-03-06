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
- **Checkout** — Place orders with Stripe or Razorpay payment integration
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
| Payments   | Stripe, Razorpay                      |
| Auth       | JWT, bcrypt                           |

## Getting Started

### Prerequisites

- Node.js (v18+)
- MongoDB database
- Cloudinary account (for image uploads)
- Stripe & Razorpay keys (for payments)
- Vonage & SMTP credentials (optional, for SMS/email)

### Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in `backend/`:

```env
PORT=4000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
STRIPE_SECRET_KEY=your_stripe_secret
RAZORPAY_KEY_ID=your_razorpay_key
RAZORPAY_KEY_SECRET=your_razorpay_secret
# Optional: Email & SMS
MAIL_HOST=your_smtp_host
MAIL_USER=your_email
MAIL_PASS=your_password
VONAGE_API_KEY=your_vonage_key
VONAGE_API_SECRET=your_vonage_secret
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

ISC
