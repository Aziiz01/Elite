import jwt from 'jsonwebtoken'

const adminAuth = async (req, res, next) => {
    try {
        const { token } = req.headers
        if (!token) {
            return res.status(401).json({ success: false, message: "Not authorized. Please login again." })
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        if (decoded.role !== 'admin' || decoded.email !== process.env.ADMIN_EMAIL) {
            return res.status(403).json({ success: false, message: "Not authorized. Please login again." })
        }
        next()
    } catch (error) {
        return res.status(401).json({ success: false, message: "Not authorized. Please login again." })
    }
}

export default adminAuth