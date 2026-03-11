/**
 * Email template for price drop notifications
 * Sent to users who favorited a product when its price decreases
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
  return new Intl.NumberFormat("en", {
    style: "currency",
    currency: "TND",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount || 0);
}

export const getPriceDropEmailTemplate = ({
  customerName,
  productName,
  productImage,
  oldPrice,
  newPrice,
  productUrl,
}) => {
  const imgHtml = productImage
    ? `<img src="${escapeHtml(productImage)}" alt="" width="120" height="120" style="width: 120px; height: 120px; object-fit: cover; border-radius: 8px;" />`
    : `<div style="width: 120px; height: 120px; background: #f0f0f0; border-radius: 8px;"></div>`;

  return `
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
<tr><td style="padding: 32px;">
<h2 style="margin: 0 0 8px 0; font-size: 20px; color: #16a34a;">Price Drop Alert!</h2>
<p style="margin: 0 0 24px 0; font-size: 15px; color: #666;">Hi ${escapeHtml(customerName)},</p>
<p style="margin: 0 0 20px 0; font-size: 15px; color: #444;">Good news! A product you favorited is now on sale.</p>
<table cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 20px;">
<tr>
    <td style="padding-right: 20px; vertical-align: top;">${imgHtml}</td>
    <td style="vertical-align: top;">
        <p style="margin: 0 0 8px 0; font-size: 16px; font-weight: 600; color: #1a1a1a;">${escapeHtml(productName)}</p>
        <p style="margin: 0; font-size: 14px; color: #888;"><span style="text-decoration: line-through;">${formatPrice(oldPrice)}</span> <span style="color: #16a34a; font-weight: 600;">${formatPrice(newPrice)}</span></p>
    </td>
</tr>
</table>
<a href="${escapeHtml(productUrl || "#")}" style="display: inline-block; background: #1a1a1a; color: #fff !important; padding: 12px 24px; text-decoration: none; font-weight: 600; border-radius: 6px;">View Product</a>
</td></tr>
<tr>
    <td style="background: #f5f5f5; padding: 20px 32px; text-align: center; font-size: 12px; color: #888;">
        <p style="margin: 0;">&copy; ${new Date().getFullYear()} Elite. All rights reserved.</p>
    </td>
</tr>
</table></td></tr></table>
</body></html>`;
};
