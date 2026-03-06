import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import { sendOrderConfirmationEmail, sendOrderStatusEmail } from "../services/mailService.js";
import { sendOrderPlacedSms, sendOrderStatusSms } from "../services/smsService.js";

// Placing orders (authenticated user)
const placeOrder = async (req,res) => {
    
    try {
        
        const { userId, items, amount, address, paymentMethod } = req.body;
        const pm = paymentMethod || "COD";

        const orderData = {
            userId,
            items,
            address,
            amount,
            status: "Order Placed",
            paymentMethod: pm,
            payment: false,
            date: Date.now()
        }

        const newOrder = new orderModel(orderData)
        await newOrder.save()

        await userModel.findByIdAndUpdate(userId,{cartData:{}})

        // Send order confirmation email + SMS (non-blocking)
        const user = await userModel.findById(userId).select("email firstName lastName telephone").lean();
        const customerEmail = address?.email || user?.email;
        const customerPhone = address?.phone || user?.telephone;
        const customerName = [address?.firstName, address?.lastName].filter(Boolean).join(" ") || (user ? `${user.firstName || ""} ${user.lastName || ""}`.trim() : "Customer");
        const name = customerName || "Customer";
        const orderIdStr = newOrder._id.toString();
        if (customerEmail) {
            sendOrderConfirmationEmail({
                to: customerEmail,
                customerName: name,
                orderId: orderIdStr,
                orderDate: newOrder.date,
                items: newOrder.items,
                totalAmount: newOrder.amount,
                address: address || {},
                paymentMethod: pm,
                status: "Order Placed"
            }).catch((err) => console.error("Order confirmation email failed:", err));
        }
        if (customerPhone) {
            sendOrderPlacedSms({
                to: customerPhone,
                customerName: name,
                orderId: orderIdStr,
                amount: newOrder.amount,
                items: newOrder.items
            }).catch((err) => console.error("Order confirmation SMS failed:", err));
        }

        res.json({success:true,message:"Order Placed"})


    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
    }

}

// Placing orders (guest - no auth required)
const placeGuestOrder = async (req,res) => {
    
    try {
        
        const { userId, items, amount, address, paymentMethod } = req.body;

        if (!userId || !items || !amount || !address) {
            return res.json({ success: false, message: "userId, items, amount and address are required" })
        }

        if (!String(userId).startsWith("guest-")) {
            return res.json({ success: false, message: "Invalid guest userId" })
        }

        const orderData = {
            userId,
            items,
            address,
            amount,
            status: "Order Placed",
            paymentMethod: paymentMethod || "COD",
            payment: false,
            date: Date.now()
        }

        const newOrder = new orderModel(orderData)
        await newOrder.save()

        // Send order confirmation email + SMS for guest (non-blocking)
        const customerEmail = address?.email;
        const customerPhone = address?.phone;
        const customerName = [address?.firstName, address?.lastName].filter(Boolean).join(" ") || "Customer";
        const orderIdStr = newOrder._id.toString();
        if (customerEmail) {
            sendOrderConfirmationEmail({
                to: customerEmail,
                customerName,
                orderId: orderIdStr,
                orderDate: newOrder.date,
                items: newOrder.items,
                totalAmount: newOrder.amount,
                address: address || {},
                paymentMethod: paymentMethod || "COD",
                status: "Order Placed"
            }).catch((err) => console.error("Order confirmation email failed:", err));
        }
        if (customerPhone) {
            sendOrderPlacedSms({
                to: customerPhone,
                customerName,
                orderId: orderIdStr,
                amount: newOrder.amount,
                items: newOrder.items
            }).catch((err) => console.error("Order confirmation SMS failed:", err));
        }

        res.json({success:true,message:"Order Placed"})

    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
    }

}

// All Orders data for Admin Panel
const allOrders = async (req,res) => {

    try {
        
        const orders = await orderModel.find({})
        res.json({success:true,orders})

    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
    }

}

// User Order Data For Forntend
const userOrders = async (req,res) => {
    try {
        
        const { userId } = req.body

        const orders = await orderModel.find({ userId })
        res.json({success:true,orders})

    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
    }
}

// update order status from Admin Panel
const updateStatus = async (req,res) => {
    try {
        
        const { orderId, status } = req.body

        const order = await orderModel.findById(orderId)
        if (!order) {
            return res.json({ success: false, message: "Order not found" })
        }

        await orderModel.findByIdAndUpdate(orderId, { status })

        // Send email + SMS for status update (non-blocking)
        const address = order.address || {}
        let email = address.email
        let phone = address.phone
        let name = [address.firstName, address.lastName].filter(Boolean).join(" ") || "Customer"

        if ((!email || !phone) && order.userId && !String(order.userId).startsWith("guest-")) {
            const user = await userModel.findById(order.userId).select("email telephone firstName lastName").lean()
            if (user) {
                if (!email) email = user.email
                if (!phone) phone = user.telephone
                if (name === "Customer") name = `${user.firstName || ""} ${user.lastName || ""}`.trim() || "Customer"
            }
        }

        if (email) {
            sendOrderStatusEmail({ to: email, customerName: name, orderId: order._id.toString(), orderDate: order.date, status, items: order.items, totalAmount: order.amount }).catch((e) => console.error("Status email failed:", e))
        }
        if (phone) {
            sendOrderStatusSms({ to: phone, customerName: name, orderId: order._id.toString(), status, items: order.items }).catch((e) => console.error("Status SMS failed:", e))
        }

        res.json({success:true,message:'Status Updated'})

    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
    }
}

export {placeOrder, placeGuestOrder, allOrders, userOrders, updateStatus}