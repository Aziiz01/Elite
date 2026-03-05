import validator from "validator";
import bcrypt from "bcrypt"
import jwt from 'jsonwebtoken'
import userModel from "../models/userModel.js";


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
        
        const {email,password} = req.body

        if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
            const token = jwt.sign(email+password,process.env.JWT_SECRET);
            res.json({success:true,token})
        } else {
            res.json({success:false,message:"Invalid credentials"})
        }

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }
}


export { loginUser, registerUser, adminLogin, listUsers, updateUser, removeUser }