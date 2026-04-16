import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import productModel from "../models/productModel.js";
import { sendOrderConfirmationEmail, sendOrderStatusEmail } from "../services/mailService.js";
import { sendOrderPlacedSms, sendOrderStatusSms } from "../services/smsService.js";

// Validate items and compute server-side amount. Returns { valid, amount, validatedItems, error }
const validateOrderItems = async (items, deliveryFee = 0) => {
    if (!Array.isArray(items) || items.length === 0) {
        return { valid: false, error: "No order items" };
    }
    const validatedItems = [];
    let totalAmount = 0;

    for (const it of items) {
        const productId = it._id;
        const color = it.color;
        const qty = Math.max(1, Number(it.quantity) || 1);

        if (!productId || !color) {
            return { valid: false, error: "Each item must have product id and color" };
        }

        const product = await productModel.findById(productId).lean();
        if (!product) {
            return { valid: false, error: `Product not found: ${productId}` };
        }
        if (!product.inStock) {
            return { valid: false, error: `Product "${product.name}" is out of stock` };
        }
        const validColors = Array.isArray(product.colors) ? product.colors : [];
        if (!validColors.includes(color)) {
            return { valid: false, error: `Invalid color "${color}" for product "${product.name}"` };
        }

        const price = product.newPrice != null && product.newPrice !== "" ? product.newPrice : product.price;
        const itemTotal = price * qty;
        totalAmount += itemTotal;

        validatedItems.push({
            _id: product._id,
            name: product.name,
            image: product.image,
            color,
            quantity: qty,
            displayPrice: price
        });
    }

    totalAmount += deliveryFee;
    return { valid: true, amount: totalAmount, validatedItems };
};

// Placing orders (authenticated user)
const placeOrder = async (req,res) => {
    
    try {
        
        const { userId, items, address, paymentMethod } = req.body;

        if (!userId || !items || !address) {
            return res.json({ success: false, message: "userId, items and address are required" });
        }

        const deliveryFee = 10;
        const validation = await validateOrderItems(items, deliveryFee);
        if (!validation.valid) {
            return res.json({ success: false, message: validation.error });
        }

        const orderData = {
            userId,
            items: validation.validatedItems,
            address,
            amount: validation.amount,
            status: "Order Placed",
            paymentMethod: paymentMethod || "COD",
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
                paymentMethod: "COD",
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

        res.json({ success: true, message: "Order Placed", orderId: orderIdStr })


    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
    }

}

// Placing orders (guest - no auth required)
const placeGuestOrder = async (req,res) => {
    
    try {
        
        const { userId, items, address, paymentMethod } = req.body;

        if (!userId || !items || !address) {
            return res.json({ success: false, message: "userId, items and address are required" });
        }

        if (!String(userId).startsWith("guest-")) {
            return res.json({ success: false, message: "Invalid guest userId" });
        }

        const deliveryFee = 10;
        const validation = await validateOrderItems(items, deliveryFee);
        if (!validation.valid) {
            return res.json({ success: false, message: validation.error });
        }

        const orderData = {
            userId,
            items: validation.validatedItems,
            address,
            amount: validation.amount,
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
                paymentMethod: "COD",
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

        res.json({ success: true, message: "Order Placed", orderId: newOrder._id.toString() })

    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
    }

}

// Guest order lookup (no auth - verified by orderId + email)
const trackGuestOrder = async (req, res) => {
    try {
        const { orderId, email } = req.body
        if (!orderId || !email) {
            return res.status(400).json({ success: false, message: "Order ID and email are required" })
        }
        const order = await orderModel.findById(orderId).lean()
        if (!order) {
            return res.status(404).json({ success: false, message: "Order not found" })
        }
        if (!String(order.userId || "").startsWith("guest-")) {
            return res.status(403).json({ success: false, message: "Use your account to view this order" })
        }
        const orderEmail = String(order.address?.email || "").trim().toLowerCase()
        const inputEmail = String(email).trim().toLowerCase()
        if (orderEmail !== inputEmail) {
            return res.status(403).json({ success: false, message: "Email does not match this order" })
        }
        res.json({ success: true, order })
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: error.message })
    }
}

// Guest order lookup by email only (no order ID required)
const trackGuestOrdersByEmail = async (req, res) => {
    try {
        const { email } = req.body
        if (!email || !String(email).trim()) {
            return res.status(400).json({ success: false, message: "Email requis" })
        }
        const normalised = String(email).trim().toLowerCase()
        const orders = await orderModel
            .find({ "address.email": { $regex: new RegExp(`^${normalised}$`, "i") } })
            .lean()
        const guestOrders = orders.filter((o) => String(o.userId || "").startsWith("guest-"))
        if (guestOrders.length === 0) {
            return res.status(404).json({ success: false, message: "Aucune commande trouvée pour cet e-mail." })
        }
        // Sort newest first, strip sensitive fields
        guestOrders.sort((a, b) => new Date(b.date) - new Date(a.date))
        res.json({ success: true, orders: guestOrders })
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: error.message })
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

export { placeOrder, placeGuestOrder, trackGuestOrder, trackGuestOrdersByEmail, allOrders, userOrders, updateStatus }