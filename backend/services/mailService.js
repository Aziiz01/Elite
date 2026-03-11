import transporter from "../config/mail.js";
import { getOrderConfirmationTemplate } from "../utils/emailTemplates/orderConfirmation.js";
import {
    getOrderPlacedEmailTemplate,
    getOutForDeliveryEmailTemplate,
    getOrderDeliveredEmailTemplate
} from "../utils/emailTemplates/orderStatusUpdate.js";
import { getPriceDropEmailTemplate } from "../utils/emailTemplates/priceDropNotification.js";

/**
 * Sends order confirmation email to the customer (full order details)
 */
export const sendOrderConfirmationEmail = async ({
    to,
    customerName,
    orderId,
    orderDate,
    items,
    totalAmount,
    address,
    paymentMethod,
    status = "Order Placed"
}) => {
    if (!to || !String(to).trim()) {
        return { success: false, error: "Recipient email is required" };
    }

    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
        console.warn("Mail: SMTP not configured. Skipping order confirmation email.");
        return { success: false, error: "SMTP not configured" };
    }

    try {
        const formattedDate = new Date(orderDate).toLocaleString("en-IN", {
            dateStyle: "medium",
            timeStyle: "short"
        });

        const html = getOrderConfirmationTemplate({
            customerName: customerName || "Customer",
            orderId,
            orderDate: formattedDate,
            items: items || [],
            totalAmount: totalAmount || 0,
            address: address || {},
            paymentMethod: paymentMethod || "COD",
            status
        });

        await transporter.sendMail({
            from: process.env.MAIL_FROM || `"Elite" <${process.env.SMTP_USER}>`,
            to: to.trim(),
            subject: `Order Confirmed - Elite #${orderId}`,
            html
        });

        return { success: true };
    } catch (error) {
        console.error("Mail: Failed to send order confirmation:", error.message);
        return { success: false, error: error.message };
    }
};

/**
 * Sends order status update email (Order Placed, Out for Delivery, Delivered)
 */
export const sendOrderStatusEmail = async ({ to, customerName, orderId, orderDate, status, items, totalAmount }) => {
    if (!to || !String(to).trim()) {
        return { success: false, error: "Recipient email is required" };
    }

    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
        console.warn("Mail: SMTP not configured. Skipping status email.");
        return { success: false, error: "SMTP not configured" };
    }

    const normalized = (status || "").toLowerCase().replace(/\s+/g, " ");
    const formattedDate = orderDate ? new Date(orderDate).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" }) : "";
    const orderItems = items || [];
    const amount = totalAmount || 0;

    let html;
    let subject;

    if (normalized.includes("out for delivery") || normalized === "out for delivery") {
        html = getOutForDeliveryEmailTemplate({ customerName: customerName || "Customer", orderId, items: orderItems, totalAmount: amount });
        subject = `Your Elite order #${orderId} is out for delivery`;
    } else if (normalized.includes("delivered")) {
        html = getOrderDeliveredEmailTemplate({ customerName: customerName || "Customer", orderId, items: orderItems, totalAmount: amount });
        subject = `Your Elite order #${orderId} has been delivered`;
    } else {
        html = getOrderPlacedEmailTemplate({ customerName: customerName || "Customer", orderId, orderDate: formattedDate, items: orderItems, totalAmount: amount });
        subject = `Order Confirmed - Elite #${orderId}`;
    }

    try {
        await transporter.sendMail({
            from: process.env.MAIL_FROM || `"Elite" <${process.env.SMTP_USER}>`,
            to: to.trim(),
            subject,
            html
        });
        return { success: true };
    } catch (error) {
        console.error("Mail: Failed to send status email:", error.message);
        return { success: false, error: error.message };
    }
};

/**
 * Sends price drop notification to users who favorited the product
 */
export const sendPriceDropEmail = async ({ to, customerName, productName, productImage, oldPrice, newPrice, productUrl }) => {
    if (!to || !String(to).trim()) {
        return { success: false, error: "Recipient email is required" };
    }

    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
        console.warn("Mail: SMTP not configured. Skipping price drop email.");
        return { success: false, error: "SMTP not configured" };
    }

    try {
        const html = getPriceDropEmailTemplate({
            customerName: customerName || "Customer",
            productName: productName || "Product",
            productImage: productImage || null,
            oldPrice,
            newPrice,
            productUrl,
        });

        await transporter.sendMail({
            from: process.env.MAIL_FROM || `"Elite" <${process.env.SMTP_USER}>`,
            to: to.trim(),
            subject: `Price drop! ${productName || "A product you favorited"} is now on sale`,
            html,
        });
        return { success: true };
    } catch (error) {
        console.error("Mail: Failed to send price drop email:", error.message);
        return { success: false, error: error.message };
    }
};
