const mongoose = require('mongoose');
const User = require('../models/User');

// @desc    Register a new user
// @route   POST /api/users/register
// @access  Public
const registerUser = async (req, res) => {
    try {
        let { name, fatherName, rollNo, address, phoneNo } = req.body;

        // Clean and trim string inputs
        name = typeof name === 'string' ? name.trim() : '';
        fatherName = typeof fatherName === 'string' ? fatherName.trim() : '';
        rollNo = typeof rollNo === 'string' ? rollNo.trim().toUpperCase() : '';
        address = typeof address === 'string' ? address.trim() : '';
        phoneNo = typeof phoneNo === 'string' ? phoneNo.trim() : '';

        // Validation - Check if all mandatory fields are provided
        if (!name || !fatherName || !rollNo || !address || !phoneNo) {
            return res.status(400).json({
                success: false,
                message: 'Kripya sabhi fields (name, fatherName, rollNo, address, phoneNo) bharein.'
            });
        }

        // Check if user/student with same Roll No already exists
        const existingUser = await User.findOne({ rollNo });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'Yeh Roll No pehle se registered hai.'
            });
        }

        // Create new User record
        const newUser = await User.create({
            name,
            fatherName,
            rollNo,
            address,
            phoneNo
        });

        return res.status(201).json({
            success: true,
            message: 'Registration safaltapurvak ho gaya hai!',
            data: newUser
        });
    } catch (error) {
        // Handle Mongoose Duplicate Key Error (E11000)
        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: 'Yeh Roll No pehle se registered hai.'
            });
        }

        // Handle Mongoose Validation Errors
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(val => val.message);
            return res.status(400).json({
                success: false,
                message: messages.join(', ')
            });
        }

        return res.status(500).json({
            success: false,
            message: 'Server error occurred',
            error: error.message
        });
    }
};

// @desc    Get all registered users
// @route   GET /api/users
// @access  Public
const getUsers = async (req, res) => {
    try {
        const users = await User.find().sort({ createdAt: -1 });
        return res.status(200).json({
            success: true,
            count: users.length,
            data: users
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Server error occurred',
            error: error.message
        });
    }
};

// @desc    Delete a user by ID
// @route   DELETE /api/users/:id
// @access  Public
const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        // Check if ID is a valid MongoDB ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid Student ID format.'
            });
        }

        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Student record nahi mila.'
            });
        }

        await User.findByIdAndDelete(id);
        return res.status(200).json({
            success: true,
            message: 'Student record safaltapurvak delete ho gaya.'
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Server error occurred',
            error: error.message
        });
    }
};

module.exports = {
    registerUser,
    getUsers,
    deleteUser
};
