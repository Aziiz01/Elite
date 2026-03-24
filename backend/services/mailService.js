import transporter from "../config/mail.js";
import { getOrderConfirmationTemplate } from "../utils/emailTemplates/orderConfirmation.js";
import {
    getOrderPlacedEmailTemplate,
    getOutForDeliveryEmailTemplate,
    getOrderDeliveredEmailTemplate
} from "../utils/emailTemplates/orderStatusUpdate.js";
import { getPriceDropEmailTemplate } from "../utils/emailTemplates/priceDropNotification.js";
import { getNewsletterWelcomeTemplate } from "../utils/emailTemplates/newsletterWelcome.js";

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

        const frontendUrl = (process.env.FRONTEND_URL || "http://localhost:5173").replace(/\/$/, "");
        const trackOrderUrl = `${frontendUrl}/order-status/${orderId}`;

        const html = getOrderConfirmationTemplate({
            customerName: customerName || "Customer",
            orderId,
            orderDate: formattedDate,
            items: items || [],
            totalAmount: totalAmount || 0,
            address: address || {},
            paymentMethod: paymentMethod || "COD",
            status,
            trackOrderUrl
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

/**
 * Sends newsletter welcome email after subscription
 */
export const sendNewsletterWelcomeEmail = async ({ to }) => {
    if (!to || !String(to).trim()) {
        return { success: false, error: "Recipient email is required" };
    }

    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
        console.warn("Mail: SMTP not configured. Skipping newsletter welcome email.");
        return { success: false, error: "SMTP not configured" };
    }

    try {
        const html = getNewsletterWelcomeTemplate({ email: to.trim() });

        await transporter.sendMail({
            from: process.env.MAIL_FROM || `"Elite" <${process.env.SMTP_USER}>`,
            to: to.trim(),
            subject: "Welcome to Elite – You're in!",
            html
        });

        return { success: true };
    } catch (error) {
        console.error("Mail: Failed to send newsletter welcome:", error.message);
        return { success: false, error: error.message };
    }
};

/**
 * Sends a personalized email to a subscriber (admin bulk/custom emails)
 * body: HTML string for the email content
 */
export const sendNewsletterCustomEmail = async ({ to, subject, body }) => {
    if (!to || !String(to).trim()) {
        return { success: false, error: "Recipient email is required" };
    }
    if (!subject || !String(subject).trim()) {
        return { success: false, error: "Subject is required" };
    }

    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
        console.warn("Mail: SMTP not configured. Skipping newsletter email.");
        return { success: false, error: "SMTP not configured" };
    }

    const wrappedHtml = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, sans-serif; background-color: #f5f5f5;">
<table width="100%" cellspacing="0" cellpadding="0" style="background: #f5f5f5; padding: 24px 0;">
<tr><td align="center">
<table width="600" cellspacing="0" cellpadding="0" style="max-width: 600px; background: #fff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.08);">
<tr>
    <td style="background: #1a1a1a; color: #ffffff; padding: 24px 32px; text-align: center;">
        <h1 style="margin: 0; font-size: 28px; font-weight: 600; letter-spacing: 2px;">ELITE</h1>
    </td>
</tr>
<tr><td style="padding: 32px; font-size: 15px; color: #444; line-height: 1.6;">
${body || "<p>No content.</p>"}
</td></tr>
<tr>
    <td style="background: #f5f5f5; padding: 20px 32px; text-align: center; font-size: 12px; color: #888;">
        <p style="margin: 0;">&copy; ${new Date().getFullYear()} Elite. All rights reserved.</p>
    </td>
</tr>
</table></td></tr></table>
</body></html>`;

    try {
        await transporter.sendMail({
            from: process.env.MAIL_FROM || `"Elite" <${process.env.SMTP_USER}>`,
            to: to.trim(),
            subject: subject.trim(),
            html: wrappedHtml
        });

        return { success: true };
    } catch (error) {
        console.error("Mail: Failed to send newsletter email:", error.message);
        return { success: false, error: error.message };
    }
};
