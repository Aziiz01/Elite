/**
 * SMS templates for order notifications
 * items: [{ name, quantity }] - optional, for listing products in message
 */

function formatItemsList(items) {
    if (!Array.isArray(items) || items.length === 0) return "";
    return items.map((i) => `${i.name || "Item"} (x${i.quantity || 1})`).join(", ");
}

export const getOrderPlacedSms = ({ customerName, orderId, amount, items }) => {
    const itemsStr = formatItemsList(items);
    const detail = itemsStr ? ` Items: ${itemsStr}.` : "";
    return `Hi ${customerName}, your Elite order #${orderId} has been placed.${detail} Total: ${amount} Dt. Thank you!`;
};

export const getOutForDeliverySms = ({ customerName, orderId, items }) => {
    const itemsStr = formatItemsList(items);
    const detail = itemsStr ? ` (${itemsStr})` : "";
    return `Hi ${customerName}, your Elite order #${orderId}${detail} is out for delivery. Expect it soon!`;
};

export const getOrderDeliveredSms = ({ customerName, orderId, items }) => {
    const itemsStr = formatItemsList(items);
    const detail = itemsStr ? ` (${itemsStr})` : "";
    return `Hi ${customerName}, your Elite order #${orderId}${detail} has been delivered. Thank you for shopping with us!`;
};
