import crypto from "crypto";
import validator from "validator";
import bcrypt from "bcrypt"
import jwt from 'jsonwebtoken'
import userModel from "../models/userModel.js";
import { sendPasswordResetEmail } from "../services/mailService.js";


const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET)
}

// Route for user login
const loginUser = async (req, res) => {
    try {

        const { email, password } = req.body;

        const user = await userModel.findOne({ email });

        if (!user) {
            return res.json({ success: false, message: "User doesn't exists" })
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (isMatch) {

            const token = createToken(user._id)
            res.json({ success: true, token })

        }
        else {
            res.json({ success: false, message: 'Invalid credentials' })
        }

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }
}

// Route for user register
const registerUser = async (req, res) => {
    try {

        const { firstName, lastName, email, password, city, address, telephone, postalCode } = req.body;

        // checking user already exists or not
        const exists = await userModel.findOne({ email });
        if (exists) {
            return res.json({ success: false, message: "User already exists" })
        }

        // validating required fields
        if (!firstName || !lastName) {
            return res.json({ success: false, message: "First name and last name are required" })
        }
        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Please enter a valid email" })
        }
        if (password.length < 8) {
            return res.json({ success: false, message: "Please enter a strong password (min 8 characters)" })
        }
        if (!city || !address) {
            return res.json({ success: false, message: "City and address are required" })
        }
        if (!telephone || telephone.trim().length < 8) {
            return res.json({ success: false, message: "Please enter a valid telephone number" })
        }
        if (!postalCode || postalCode.trim().length < 3) {
            return res.json({ success: false, message: "Please enter a valid postal code" })
        }

        // hashing user password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const newUser = new userModel({
            firstName: firstName.trim(),
            lastName: lastName.trim(),
            email: email.trim().toLowerCase(),
            password: hashedPassword,
            city: city.trim(),
            address: address.trim(),
            telephone: telephone.trim(),
            postalCode: postalCode.trim()
        })

        const user = await newUser.save()

        const token = createToken(user._id)

        res.json({ success: true, token })

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }
}

// Route for get current user profile (authenticated)
const getUserProfile = async (req, res) => {
    try {
        const { userId } = req.body
        if (!userId) {
            return res.json({ success: false, message: "Not authenticated" })
        }
        const user = await userModel.findById(userId).select('-password').lean()
        if (!user) {
            return res.json({ success: false, message: "User not found" })
        }
        res.json({ success: true, user })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// Route for list all users (admin only)
const listUsers = async (req, res) => {
    try {
        const users = await userModel.find({}).select('-password').lean()
        res.json({ success: true, users })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// Route for update own profile (authenticated user) - only address, telephone, password
const updateProfile = async (req, res) => {
    try {
        const { userId, address, telephone, newPassword } = req.body

        if (!userId) {
            return res.json({ success: false, message: "Not authenticated" })
        }

        const user = await userModel.findById(userId)
        if (!user) {
            return res.json({ success: false, message: "User not found" })
        }

        if (address !== undefined) {
            if (!address || !address.trim()) {
                return res.json({ success: false, message: "Address is required" })
            }
            user.address = address.trim()
        }
        if (telephone !== undefined) {
            if (!telephone || telephone.trim().length < 8) {
                return res.json({ success: false, message: "Please enter a valid telephone number (min 8 characters)" })
            }
            user.telephone = telephone.trim()
        }
        if (newPassword && newPassword.length >= 8) {
            const salt = await bcrypt.genSalt(10)
            user.password = await bcrypt.hash(newPassword, salt)
        }

        await user.save()
        res.json({ success: true, message: "Profile updated" })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// Route for update user (admin only)
const updateUser = async (req, res) => {
    try {
        const { id, firstName, lastName, email, city, address, telephone, postalCode, newPassword } = req.body

        if (!id) {
            return res.json({ success: false, message: "User ID is required" })
        }

        const user = await userModel.findById(id)
        if (!user) {
            return res.json({ success: false, message: "User not found" })
        }

        if (!firstName || !lastName) {
            return res.json({ success: false, message: "First name and last name are required" })
        }
        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Please enter a valid email" })
        }
        if (!city || !address) {
            return res.json({ success: false, message: "City and address are required" })
        }
        if (!telephone || telephone.trim().length < 8) {
            return res.json({ success: false, message: "Please enter a valid telephone number" })
        }
        if (!postalCode || postalCode.trim().length < 3) {
            return res.json({ success: false, message: "Please enter a valid postal code" })
        }

        const existingByEmail = await userModel.findOne({ email: email.trim().toLowerCase() })
        if (existingByEmail && existingByEmail._id.toString() !== id) {
            return res.json({ success: false, message: "Email already in use by another user" })
        }

        user.firstName = firstName.trim()
        user.lastName = lastName.trim()
        user.email = email.trim().toLowerCase()
        user.city = city.trim()
        user.address = address.trim()
        user.telephone = telephone.trim()
        user.postalCode = postalCode.trim()

        if (newPassword && newPassword.length >= 8) {
            const salt = await bcrypt.genSalt(10)
            user.password = await bcrypt.hash(newPassword, salt)
        }

        await user.save()
        res.json({ success: true, message: "User updated" })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// Route for remove user (admin only)
const removeUser = async (req, res) => {
    try {
        const { id } = req.body
        if (!id) {
            return res.json({ success: false, message: "User ID is required" })
        }
        await userModel.findByIdAndDelete(id)
        res.json({ success: true, message: "User removed" })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// Route for admin login
const adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body

        if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
            const token = jwt.sign(
                { role: 'admin', email: process.env.ADMIN_EMAIL },
                process.env.JWT_SECRET,
                { expiresIn: '7d' }
            )
            res.json({ success: true, token })
        } else {
            res.json({ success: false, message: "Invalid credentials" })
        }
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}


// Request password reset — generates token, sends email
const requestPasswordReset = async (req, res) => {
    try {
        const { email } = req.body
        if (!email || !validator.isEmail(String(email))) {
            return res.json({ success: false, message: "Adresse e-mail invalide." })
        }
        const user = await userModel.findOne({ email: String(email).toLowerCase().trim() })
        // Always return success to avoid user enumeration
        if (!user) {
            return res.json({ success: true, message: "Si un compte existe, un e-mail a été envoyé." })
        }

        // Generate a secure random token; store its SHA-256 hash
        const rawToken = crypto.randomBytes(32).toString("hex")
        const hashedToken = crypto.createHash("sha256").update(rawToken).digest("hex")
        const expiry = new Date(Date.now() + 60 * 60 * 1000) // 1 hour

        user.resetToken = hashedToken
        user.resetTokenExpiry = expiry
        await user.save()

        const frontendUrl = (process.env.FRONTEND_URL || "http://localhost:5173").replace(/\/$/, "")
        const resetUrl = `${frontendUrl}/reset-password?token=${rawToken}`
        const customerName = [user.firstName, user.lastName].filter(Boolean).join(" ") || "Cliente"

        sendPasswordResetEmail({ to: user.email, customerName, resetUrl })
            .catch((err) => console.error("Password reset email failed:", err))

        return res.json({ success: true, message: "Si un compte existe, un e-mail a été envoyé." })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// Reset password — verifies token, sets new password
const resetPassword = async (req, res) => {
    try {
        const { token, newPassword } = req.body
        if (!token || !newPassword) {
            return res.json({ success: false, message: "Token et nouveau mot de passe requis." })
        }
        if (newPassword.length < 8) {
            return res.json({ success: false, message: "Le mot de passe doit contenir au moins 8 caractères." })
        }

        const hashedToken = crypto.createHash("sha256").update(String(token)).digest("hex")
        const user = await userModel.findOne({
            resetToken: hashedToken,
            resetTokenExpiry: { $gt: new Date() }
        })

        if (!user) {
            return res.json({ success: false, message: "Lien invalide ou expiré. Veuillez refaire une demande." })
        }

        const salt = await bcrypt.genSalt(10)
        user.password = await bcrypt.hash(newPassword, salt)
        user.resetToken = null
        user.resetTokenExpiry = null
        await user.save()

        res.json({ success: true, message: "Mot de passe mis à jour avec succès." })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

export { loginUser, registerUser, getUserProfile, updateProfile, adminLogin, listUsers, updateUser, removeUser, requestPasswordReset, resetPassword }