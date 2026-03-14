import express from 'express'
import { placeOrder, placeGuestOrder, trackGuestOrder, allOrders, userOrders, updateStatus } from '../controllers/orderController.js'
import adminAuth  from '../middleware/adminAuth.js'
import authUser from '../middleware/auth.js'

const orderRouter = express.Router()

// Admin Features
orderRouter.post('/list',adminAuth,allOrders)
orderRouter.post('/status',adminAuth,updateStatus)

// Orders
orderRouter.post('/place',authUser,placeOrder)
orderRouter.post('/place-guest', placeGuestOrder)
orderRouter.post('/track-guest', trackGuestOrder)

// User Feature
orderRouter.post('/userorders',authUser,userOrders)

export default orderRouter