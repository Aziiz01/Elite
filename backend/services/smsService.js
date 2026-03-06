import vonage from "../config/vonage.js";
import { getOrderPlacedSms, getOutForDeliverySms, getOrderDeliveredSms } from "../utils/smsTemplates.js";

const fromNumber = process.env.VONAGE_FROM || "Elite";

/**
 * Normalize phone for E.164
 * Tunisia: +216, 8 digits (e.g. 91234567). Domestic format: 0xx xx xx xx (leading 0)
 */
function normalizePhone(phone) {
    if (!phone || typeof phone !== "string") return null;
    let p = phone.replace(/\D/g, "");
    if (p.startsWith("0")) p = p.slice(1);
    if (p.startsWith("216") && p.length === 11) return p; // 216xxxxxxxx
    if (p.length === 8) return "216" + p; // Tunisia (8 digits)
    if (p.length >= 10 && p.length <= 15) return p.replace(/^\+/, ""); // Already international (digits only)
    return null;
}

/**
 * Send order placed SMS
 */
export const sendOrderPlacedSms = async ({ to, customerName, orderId, amount, items }) => {
    const phone = normalizePhone(to);
    if (!phone) return { success: false, error: "Invalid phone number" };
    if (!vonage) {
        console.warn("SMS: Vonage not configured. Skipping order SMS.");
        return { success: false, error: "Vonage not configured" };
    }
    try {
        const text = getOrderPlacedSms({
            customerName: customerName || "Customer",
            orderId,
            amount: amount || 0,
            items: items || []
        });
        await vonage.sms.send({ to: phone, from: fromNumber, text });
        return { success: true };
    } catch (err) {
        console.error("SMS: Failed to send:", err.message);
        return { success: false, error: err.message };
    }
};

/**
 * Send order status update SMS
 */
export const sendOrderStatusSms = async ({ to, customerName, orderId, status, items }) => {
    const phone = normalizePhone(to);
    if (!phone) return { success: false, error: "Invalid phone number" };
    if (!vonage) {
        console.warn("SMS: Vonage not configured. Skipping status SMS.");
        return { success: false, error: "Vonage not configured" };
    }
    let text;
    const normalized = (status || "").toLowerCase().replace(/\s+/g, " ");
    const orderItems = items || [];
    if (normalized.includes("out for delivery") || normalized === "out for delivery") {
        text = getOutForDeliverySms({ customerName: customerName || "Customer", orderId, items: orderItems });
    } else if (normalized.includes("delivered")) {
        text = getOrderDeliveredSms({ customerName: customerName || "Customer", orderId, items: orderItems });
    } else if (normalized.includes("order placed") || normalized === "order placed") {
        text = getOrderPlacedSms({ customerName: customerName || "Customer", orderId, amount: 0, items: orderItems });
    } else {
        text = `Hi ${customerName || "Customer"}, your Elite order #${orderId} status: ${status}.`;
    }
    try {
        await vonage.sms.send({ to: phone, from: fromNumber, text });
        return { success: true };
    } catch (err) {
        console.error("SMS: Failed to send status update:", err.message);
        return { success: false, error: err.message };
    }
};
