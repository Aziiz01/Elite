/**
 * Email template for newsletter welcome
 */

function escapeHtml(str) {
  if (str == null) return ''
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

export const getNewsletterWelcomeTemplate = ({ email }) => {
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
<h2 style="margin: 0 0 16px 0; font-size: 20px; color: #1a1a1a;">Welcome to Elite!</h2>
<p style="margin: 0 0 16px 0; font-size: 15px; color: #444;">Thank you for subscribing to our newsletter. You're now part of our community.</p>
<p style="margin: 0 0 24px 0; font-size: 15px; color: #444;">You'll receive exclusive offers, new arrivals, and style tips delivered straight to your inbox.</p>
<p style="margin: 0; font-size: 14px; color: #888;">Subscribed as: ${escapeHtml(email)}</p>
</td></tr>
<tr>
    <td style="background: #f5f5f5; padding: 20px 32px; text-align: center; font-size: 12px; color: #888;">
        <p style="margin: 0;">&copy; ${new Date().getFullYear()} Elite. All rights reserved.</p>
    </td>
</tr>
</table></td></tr></table>
</body></html>`
}
