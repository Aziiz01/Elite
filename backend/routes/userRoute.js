import express from 'express';
import { loginUser, registerUser, getUserProfile, updateProfile, adminLogin, listUsers, updateUser, removeUser } from '../controllers/userController.js';
import adminAuth from '../middleware/adminAuth.js';
import authUser from '../middleware/auth.js';

const userRouter = express.Router();

userRouter.post('/register', registerUser)
userRouter.post('/login', loginUser)
userRouter.post('/profile', authUser, getUserProfile)
userRouter.post('/profile/update', authUser, updateProfile)
userRouter.post('/admin', adminLogin)
userRouter.get('/list', adminAuth, listUsers)
userRouter.post('/update', adminAuth, updateUser)
userRouter.post('/remove', adminAuth, removeUser)

export default userRouter;