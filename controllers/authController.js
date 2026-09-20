const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Generate JWT Token helper
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || 'secretkey', {
        expiresIn: process.env.JWT_EXPIRE || '30d'
    });
};

// @route   POST /api/auth/register
// @desc    Register new user (Student / Admin / Staff)
// @access  Public
exports.register = async (req, res, next) => {
    try {
        const { name, email, password, role, rollNo, fatherName, motherName, address, phoneNo } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Name, email, and password are required'
            });
        }

        const existingUser = await User.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'Email already registered'
            });
        }

        if (rollNo) {
            const existingRoll = await User.findOne({ rollNo: rollNo.toUpperCase() });
            if (existingRoll) {
                return res.status(400).json({
                    success: false,
                    message: 'Roll number is already registered'
                });
            }
        }

        const user = await User.create({
            name,
            email,
            password,
            role: role || 'student',
            rollNo,
            fatherName,
            motherName,
            address,
            phoneNo
        });

        const token = generateToken(user._id);

        res.status(201).json({
            success: true,
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                rollNo: user.rollNo
            }
        });
    } catch (error) {
        next(error);
    }
};

// @route   POST /api/auth/login
// @desc    Authenticate user & get token
// @access  Public
exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please provide email and password'
            });
        }

        // Check for user (include password field explicitly)
        const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        // Check if password matches
        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        const token = generateToken(user._id);

        res.status(200).json({
            success: true,
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                rollNo: user.rollNo
            }
        });
    } catch (error) {
        next(error);
    }
};

// @route   GET /api/auth/me
// @desc    Get currently logged in user profile
// @access  Private
exports.getMe = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);
        res.status(200).json({
            success: true,
            user
        });
    } catch (error) {
        next(error);
    }
};
