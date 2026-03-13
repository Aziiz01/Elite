import axios from 'axios';
import { toast } from 'react-toastify';

const BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Global error handling (network, 5xx, 429 - callers handle 4xx with their own messages)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
      toast.error('Connection error. Please check your network.');
      return Promise.reject(error);
    }
    const status = error.response?.status;
    const message = error.response?.data?.message;
    if (status >= 500) {
      toast.error(message || 'Server error. Please try again later.');
    } else if (status === 429) {
      toast.error('Too many requests. Please wait a moment.');
    }
    return Promise.reject(error);
  }
);

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

// Category APIs (public)
export const getCategories = () =>
  api.get('/api/category/list');

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

// Favorites APIs (require token)
export const addFavoriteApi = (productId, token) =>
  api.post('/api/favorite/add', { productId }, withAuth(token));

export const removeFavoriteApi = (productId, token) =>
  api.post('/api/favorite/remove', { productId }, withAuth(token));

export const getFavoritesApi = (token) =>
  api.post('/api/favorite/list', {}, withAuth(token));

export const checkFavoriteApi = (productId, token) =>
  api.post('/api/favorite/check', { productId }, withAuth(token));

export { BASE_URL as backendUrl };
