/**
 * Generates the HTML body for Elite order confirmation email
 * @param {Object} params
 * @param {string} params.customerName - Customer full name
 * @param {string} params.orderId - Order ID
 * @param {string} params.orderDate - Formatted order date
 * @param {Array} params.items - Order items [{ name, quantity, price, ... }]
 * @param {number} params.totalAmount - Total order amount
 * @param {Object} params.address - Delivery address
 * @param {string} params.paymentMethod - e.g. COD
 * @param {string} params.status - Order status
 */
export const getOrderConfirmationTemplate = ({
    customerName,
    orderId,
    orderDate,
    items,
    totalAmount,
    address,
    paymentMethod,
    status = "Order Placed"
}) => {
    const itemsRows = items
        .map(
            (item) => {
                const imageUrl = Array.isArray(item.image) ? item.image[0] : item.image;
                const imgHtml = imageUrl
                    ? `<img src="${escapeHtml(imageUrl)}" alt="" width="64" height="64" style="width: 64px; height: 64px; object-fit: cover; border-radius: 4px; display: block;" />`
                    : `<div style="width: 64px; height: 64px; background: #f0f0f0; border-radius: 4px; display: flex; align-items: center; justify-content: center; font-size: 10px; color: #999;">No img</div>`;
                return `
        <tr>
            <td style="padding: 10px 16px; border-bottom: 1px solid #eee; vertical-align: middle;">
                <table cellpadding="0" cellspacing="0" border="0"><tr>
                    <td style="padding-right: 12px; vertical-align: middle;">${imgHtml}</td>
                    <td style="vertical-align: middle;">${escapeHtml(item.name || "Item")}${item.color ? ` <span style="color:#888;font-size:13px">(${escapeHtml(item.color)})</span>` : ""}</td>
                </tr></table>
            </td>
            <td style="padding: 10px 16px; border-bottom: 1px solid #eee; text-align: center; vertical-align: middle;">${item.quantity || 1}</td>
            <td style="padding: 10px 16px; border-bottom: 1px solid #eee; text-align: right; vertical-align: middle;">${formatPrice((item.displayPrice ?? item.price ?? 0) * (item.quantity || 1))}</td>
        </tr>`;
            }
        )
        .join("");

    const addressLines = [
        address.street,
        [address.city, address.state].filter(Boolean).join(", "),
        address.zipcode,
        address.country
    ]
        .filter(Boolean)
        .join("<br/>");

    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f5f5;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f5f5f5; padding: 24px 0;">
        <tr>
            <td align="center">
                <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="max-width: 600px; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.08);">
                    <!-- Header -->
                    <tr>
                        <td style="background: #1a1a1a; color: #ffffff; padding: 24px 32px; text-align: center;">
                            <h1 style="margin: 0; font-size: 28px; font-weight: 600; letter-spacing: 2px;">ELITE</h1>
                        </td>
                    </tr>
                    <!-- Confirmation message -->
                    <tr>
                        <td style="padding: 32px;">
                            <h2 style="margin: 0 0 8px 0; font-size: 20px; color: #1a1a1a;">Order Confirmed</h2>
                            <p style="margin: 0 0 24px 0; font-size: 15px; color: #666;">Thank you for your order, ${escapeHtml(customerName)}.</p>
                            <table style="width: 100%; margin-bottom: 24px; background: #f9f9f9; border-radius: 6px; padding: 16px;">
                                <tr>
                                    <td style="padding: 8px 0;"><strong>Order ID:</strong></td>
                                    <td style="padding: 8px 0; text-align: right;">${escapeHtml(String(orderId))}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 8px 0;"><strong>Order Date:</strong></td>
                                    <td style="padding: 8px 0; text-align: right;">${escapeHtml(orderDate)}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 8px 0;"><strong>Status:</strong></td>
                                    <td style="padding: 8px 0; text-align: right;">${escapeHtml(status)}</td>
                                </tr>
                            </table>
                            <!-- Order items -->
                            <h3 style="margin: 0 0 12px 0; font-size: 16px; color: #1a1a1a;">Order Summary</h3>
                            <table style="width: 100%; border-collapse: collapse;">
                                <thead>
                                    <tr style="background: #f5f5f5;">
                                        <th style="padding: 10px 16px; text-align: left;">Item</th>
                                        <th style="padding: 10px 16px; text-align: center;">Qty</th>
                                        <th style="padding: 10px 16px; text-align: right;">Price</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${itemsRows}
                                </tbody>
                            </table>
                            <!-- Total -->
                            <table style="width: 100%; margin-top: 16px;">
                                <tr>
                                    <td style="padding: 12px 0; font-size: 18px; font-weight: 700; color: #1a1a1a;">Total</td>
                                    <td style="padding: 12px 0; text-align: right; font-size: 18px; font-weight: 700;">${formatPrice(totalAmount)}</td>
                                </tr>
                            </table>
                            <!-- Delivery address -->
                            <h3 style="margin: 24px 0 12px 0; font-size: 16px; color: #1a1a1a;">Delivery Address</h3>
                            <p style="margin: 0; font-size: 14px; color: #444; line-height: 1.6;">${addressLines || "—"}</p>
                            ${address.phone ? `<p style="margin: 8px 0 0 0; font-size: 14px;">Phone: ${escapeHtml(address.phone)}</p>` : ""}
                            <!-- Payment -->
                            <p style="margin: 24px 0 0 0; font-size: 14px; color: #666;"><strong>Payment method:</strong> ${escapeHtml(paymentMethod || "COD")}</p>
                        </td>
                    </tr>
                    <!-- Footer -->
                    <tr>
                        <td style="background: #f5f5f5; padding: 20px 32px; text-align: center; font-size: 12px; color: #888;">
                            <p style="margin: 0;">&copy; ${new Date().getFullYear()} Elite. All rights reserved.</p>
                            <p style="margin: 8px 0 0 0;">Questions? Contact us at support@elite.com</p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>`;
};

function escapeHtml(str) {
    if (str == null) return "";
    return String(str)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
}

function formatPrice(amount) {
    return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0
    }).format(amount);
}
