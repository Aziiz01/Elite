/**
 * Environment config validation.
 * Fails fast at startup if required vars are missing.
 */

const REQUIRED = ['MONGODB_URI', 'JWT_SECRET', 'ADMIN_EMAIL', 'ADMIN_PASSWORD']
const OPTIONAL = [
    'PORT', 'VERCEL',
    'CLOUDINARY_NAME', 'CLOUDINARY_API_KEY', 'CLOUDINARY_SECRET_KEY',
    'FRONTEND_URL', 'SMTP_HOST', 'SMTP_PORT', 'SMTP_USER', 'SMTP_PASS',
    'VONAGE_API_KEY', 'VONAGE_API_SECRET', 'VONAGE_FROM',
    'CORS_ORIGINS', 'MAIL_FROM', 'SMTP_SECURE'
]

function validateEnv() {
    const missing = REQUIRED.filter((key) => !process.env[key] || !String(process.env[key]).trim())
    if (missing.length > 0) {
        console.error('Missing required environment variables:', missing.join(', '))
        console.error('Copy .env.example to .env and fill in the values.')
        process.exit(1)
    }
    if (process.env.JWT_SECRET && process.env.JWT_SECRET.length < 32) {
        console.error('JWT_SECRET must be at least 32 characters for security.')
        process.exit(1)
    }
}

/**
 * Get CORS allowed origins.
 * Set CORS_ORIGINS as comma-separated URLs, or leave unset for dev defaults.
 */
function getCorsOrigins() {
    const env = process.env.CORS_ORIGINS
    if (env && env.trim()) {
        return env.split(',').map((o) => o.trim()).filter(Boolean)
    }
    return [
        'http://localhost:5173',
        'http://localhost:5174',
        'http://127.0.0.1:5173',
        'http://127.0.0.1:5174'
    ]
}

export { validateEnv, getCorsOrigins }
