import axios from 'axios';

const BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
const withAuth = (token) => (token ? { headers: { token } } : {});

// User APIs
export const registerUser = (data) =>
  api.post('/api/user/register', data);

export const loginUser = (data) =>
  api.post('/api/user/login', data);

export const getUserProfile = (token) =>
  api.post('/api/user/profile', {}, withAuth(token));

export const updateProfile = (data, token) =>
  api.post('/api/user/profile/update', data, withAuth(token));

// Product APIs
export const getProducts = () =>
  api.get('/api/product/list');

// Cart APIs (require token)
export const addToCartApi = (data, token) =>
  api.post('/api/cart/add', data, withAuth(token));

export const updateCartApi = (data, token) =>
  api.post('/api/cart/update', data, withAuth(token));

export const getCart = (token) =>
  api.post('/api/cart/get', {}, withAuth(token));

// Order APIs
export const placeOrder = (orderData, token) =>
  api.post('/api/order/place', orderData, withAuth(token));

export const placeGuestOrder = (orderData) =>
  api.post('/api/order/place-guest', orderData);

export const createStripeOrder = (orderData, token) =>
  api.post('/api/order/stripe', orderData, withAuth(token));

export const createRazorpayOrder = (orderData, token) =>
  api.post('/api/order/razorpay', orderData, withAuth(token));

export const verifyStripePayment = (data, token) =>
  api.post('/api/order/verifyStripe', data, withAuth(token));

export const verifyRazorpayPayment = (data, token) =>
  api.post('/api/order/verifyRazorpay', data, withAuth(token));

export const getUserOrders = (token) =>
  api.post('/api/order/userorders', {}, withAuth(token));

// Review APIs
export const getProductReviews = (productId) =>
  api.post('/api/review/product', { productId });

export const createReview = (data, token) =>
  api.post('/api/review/create', data, withAuth(token));

export const updateReviewApi = (data, token) =>
  api.post('/api/review/update', data, withAuth(token));

export const deleteReviewApi = (data, token) =>
  api.post('/api/review/delete', data, withAuth(token));

export { BASE_URL as backendUrl };
