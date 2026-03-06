/**
 * Email templates for order status updates
 * Used when admin changes order status
 * items: [{ name, image?, quantity, price? }] for order summary with photo
 */

function escapeHtml(str) {
    if (str == null) return "";
    return String(str)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
}

function formatPrice(amount) {
    return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(amount || 0);
}

function buildItemsRows(items) {
    if (!Array.isArray(items) || items.length === 0) return "";
    return items
        .map((item) => {
            const imageUrl = Array.isArray(item.image) ? item.image[0] : item.image;
            const imgHtml = imageUrl
                ? `<img src="${escapeHtml(imageUrl)}" alt="" width="48" height="48" style="width: 48px; height: 48px; object-fit: cover; border-radius: 4px;" />`
                : `<div style="width: 48px; height: 48px; background: #f0f0f0; border-radius: 4px;"></div>`;
            return `
<tr>
    <td style="padding: 8px 12px; border-bottom: 1px solid #eee; vertical-align: middle;">
        <table cellpadding="0" cellspacing="0" border="0"><tr>
            <td style="padding-right: 10px; vertical-align: middle;">${imgHtml}</td>
            <td style="vertical-align: middle;">${escapeHtml(item.name || "Item")}${item.color ? ` <span style="color:#888;font-size:12px">(${escapeHtml(item.color)})</span>` : ""}</td>
        </tr></table>
    </td>
    <td style="padding: 8px 12px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity || 1}</td>
    <td style="padding: 8px 12px; border-bottom: 1px solid #eee; text-align: right;">${formatPrice((item.displayPrice ?? item.price ?? 0) * (item.quantity || 1))}</td>
</tr>`;
        })
        .join("");
}

const baseHeader = `
<tr>
    <td style="background: #1a1a1a; color: #ffffff; padding: 24px 32px; text-align: center;">
        <h1 style="margin: 0; font-size: 28px; font-weight: 600; letter-spacing: 2px;">ELITE</h1>
    </td>
</tr>`;

const baseFooter = `
<tr>
    <td style="background: #f5f5f5; padding: 20px 32px; text-align: center; font-size: 12px; color: #888;">
        <p style="margin: 0;">&copy; ${new Date().getFullYear()} Elite. All rights reserved.</p>
        <p style="margin: 8px 0 0 0;">Questions? Contact us at support@elite.com</p>
    </td>
</tr>`;

const orderSummaryBlock = (items, totalAmount) => {
    const rows = buildItemsRows(items);
    if (!rows) return "";
    const total = Array.isArray(items) && items.length
        ? items.reduce((sum, i) => sum + (i.displayPrice ?? i.price ?? 0) * (i.quantity || 1), 0)
        : totalAmount || 0;
    return `
<h3 style="margin: 16px 0 8px 0; font-size: 15px; color: #1a1a1a;">Order summary</h3>
<table style="width: 100%; border-collapse: collapse;">
<thead><tr style="background: #f5f5f5;">
<th style="padding: 8px 12px; text-align: left;">Product</th>
<th style="padding: 8px 12px; text-align: center;">Qty</th>
<th style="padding: 8px 12px; text-align: right;">Price</th>
</tr></thead>
<tbody>${rows}</tbody>
</table>
<p style="margin: 8px 0 0 0; font-weight: 700;">Total: ${formatPrice(total)}</p>`;
};

export const getOrderPlacedEmailTemplate = ({ customerName, orderId, orderDate, items, totalAmount }) => `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, sans-serif; background-color: #f5f5f5;">
<table width="100%" cellspacing="0" cellpadding="0" style="background: #f5f5f5; padding: 24px 0;">
<tr><td align="center">
<table width="600" cellspacing="0" cellpadding="0" style="max-width: 600px; background: #fff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.08);">
${baseHeader}
<tr><td style="padding: 32px;">
<h2 style="margin: 0 0 8px 0; font-size: 20px; color: #1a1a1a;">Order Confirmed</h2>
<p style="margin: 0 0 24px 0; font-size: 15px; color: #666;">Hi ${escapeHtml(customerName)},</p>
<p style="margin: 0 0 16px 0; font-size: 15px; color: #444;">Your order has been placed successfully.</p>
<table style="width: 100%; background: #f9f9f9; border-radius: 6px; padding: 16px;">
<tr><td style="padding: 8px 0;"><strong>Order ID:</strong></td><td style="padding: 8px 0; text-align: right;">${escapeHtml(String(orderId))}</td></tr>
<tr><td style="padding: 8px 0;"><strong>Order Date:</strong></td><td style="padding: 8px 0; text-align: right;">${escapeHtml(orderDate)}</td></tr>
<tr><td style="padding: 8px 0;"><strong>Status:</strong></td><td style="padding: 8px 0; text-align: right;">Order Placed</td></tr>
</table>
${orderSummaryBlock(items, totalAmount)}
</td></tr>
${baseFooter}
</table></td></tr></table>
</body></html>`;

export const getOutForDeliveryEmailTemplate = ({ customerName, orderId, items, totalAmount }) => `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, sans-serif; background-color: #f5f5f5;">
<table width="100%" cellspacing="0" cellpadding="0" style="background: #f5f5f5; padding: 24px 0;">
<tr><td align="center">
<table width="600" cellspacing="0" cellpadding="0" style="max-width: 600px; background: #fff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.08);">
${baseHeader}
<tr><td style="padding: 32px;">
<h2 style="margin: 0 0 8px 0; font-size: 20px; color: #1a1a1a;">Order Out for Delivery</h2>
<p style="margin: 0 0 24px 0; font-size: 15px; color: #666;">Hi ${escapeHtml(customerName)},</p>
<p style="margin: 0 0 16px 0; font-size: 15px; color: #444;">Great news! Your order is on its way.</p>
<table style="width: 100%; background: #f9f9f9; border-radius: 6px; padding: 16px;">
<tr><td style="padding: 8px 0;"><strong>Order ID:</strong></td><td style="padding: 8px 0; text-align: right;">${escapeHtml(String(orderId))}</td></tr>
<tr><td style="padding: 8px 0;"><strong>Status:</strong></td><td style="padding: 8px 0; text-align: right; color: #2563eb; font-weight: 600;">Out for Delivery</td></tr>
</table>
${orderSummaryBlock(items, totalAmount)}
<p style="margin: 16px 0 0 0; font-size: 14px; color: #666;">Please ensure someone is available to receive the delivery.</p>
</td></tr>
${baseFooter}
</table></td></tr></table>
</body></html>`;

export const getOrderDeliveredEmailTemplate = ({ customerName, orderId, items, totalAmount }) => `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, sans-serif; background-color: #f5f5f5;">
<table width="100%" cellspacing="0" cellpadding="0" style="background: #f5f5f5; padding: 24px 0;">
<tr><td align="center">
<table width="600" cellspacing="0" cellpadding="0" style="max-width: 600px; background: #fff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.08);">
${baseHeader}
<tr><td style="padding: 32px;">
<h2 style="margin: 0 0 8px 0; font-size: 20px; color: #1a1a1a;">Order Delivered</h2>
<p style="margin: 0 0 24px 0; font-size: 15px; color: #666;">Hi ${escapeHtml(customerName)},</p>
<p style="margin: 0 0 16px 0; font-size: 15px; color: #444;">Your order has been delivered successfully. Thank you for shopping with Elite!</p>
<table style="width: 100%; background: #f0fdf4; border-radius: 6px; padding: 16px;">
<tr><td style="padding: 8px 0;"><strong>Order ID:</strong></td><td style="padding: 8px 0; text-align: right;">${escapeHtml(String(orderId))}</td></tr>
<tr><td style="padding: 8px 0;"><strong>Status:</strong></td><td style="padding: 8px 0; text-align: right; color: #16a34a; font-weight: 600;">Delivered</td></tr>
</table>
${orderSummaryBlock(items, totalAmount)}
<p style="margin: 16px 0 0 0; font-size: 14px; color: #666;">We hope you enjoy your purchase. See you again!</p>
</td></tr>
${baseFooter}
</table></td></tr></table>
</body></html>`;
