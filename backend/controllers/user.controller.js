import { User } from '../models/user.model.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const register = async (req, res) => {
    try {
        const { fullName, email, phoneNumber, password, role } = req.body;
        if (!fullName || !email || !phoneNumber || !password || !role) {
            return res.status(400).json({
                message: "Please fill in all required fields.",
                success: false
            })
        }
        const user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({
                message: 'user already exists',
                success: false
            })
        }
        const hashedPassword = await bcrypt.hash(password, 10);

        await User.create({
            fullName,
            email,
            phoneNumber,
            password: hashedPassword,
            role,
        })

        return res.status(200).json({
            message: 'Account created successfully',
            success: true
        })
    }
    catch (e) {
        console.log(e);
    }
}

export const login = async (req, res) => {
    try {
        const { email, password, role } = req.body;
        if (!email || !password || !role) {
            return res.status(400).json({
                message: 'Please fill in all required fields',
                success: false
            })
        }
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                message: 'Incorrect credentials',
                success: false
            })
        }
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(400).json({
                message: 'Incorrect credentials',
                success: false
            })
        }
        if (role !== user.role) {
            return res.status(400).json({
                message: "Your role doesn't match with your account",
                success: false
            })
        }

        const tokenData = {
            userId: user._id
        }
        const token = await jwt.sign(tokenData, process.env.JWT_SECRET_KEY, { expiresIn: '1d' });

        user = {
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            phoneNumber: user.phoneNumber,
            role: user.role,
            profile: user.profile
        }

        return res.status(200).cookie('token', token, { maxAge: 1 * 24 * 60 * 60 * 1000, httpsOnly: true, sameSite: 'strict' }).json({
            message: `Welcome back ${user.fullName}`,
            user,
            success: true
        });
    }
    catch (e) {
        console.log(e);
    }
}

export const logout = async (req, res) => {
    try {
        return res.status(200).cookie('token', '', { maxAge: 0 }).json({
            message: 'logged out successfully',
            success: true
        })
    }
    catch (e) {
        console.log(e);
    }
}

export const updateProfile = async (req, res) => {
    try {
        console.log("Request ID:", req.id);
        const { fullName, email, phoneNumber, bio, skills } = req.body;
        const file = req.file;

        let skillsArray;
        if(skills){
            skillsArray = skills.split(',');
        }

        const userId = req.id;
        let user = await User.findById(userId);

        if (!user) {
            console.log("User not found for ID:", userId); 
            return res.status(400).json({
                message: 'User not found',
                success: false
            })
        }
        //data update
        if(fullName) user.fullName = fullName
        if(email) user.email = email
        if(phoneNumber) user.phoneNumber = phoneNumber   
        if(bio) user.profile.bio = bio
        if(skills) user.profile.skills = skillsArray   

        await user.save();

        user = {
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            phoneNumber: user.phoneNumber,
            role: user.role,
            profile: user.profile
        }

        return res.status(200).json({
            message: 'profile updated successfully',
            user,
            success:true
        })
    }
    catch (e) {
        console.log(e);
    }
}