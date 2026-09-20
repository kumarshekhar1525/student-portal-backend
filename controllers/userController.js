const mongoose = require('mongoose');
const User = require('../models/User');

// @desc    Register a new user / student
// @route   POST /api/users/register
// @access  Public
const registerUser = async (req, res) => {
    try {
        let { name, fatherName, motherName, rollNo, address, phoneNo } = req.body;

        // Clean and trim string inputs
        name = typeof name === 'string' ? name.trim() : '';
        fatherName = typeof fatherName === 'string' ? fatherName.trim() : '';
        motherName = typeof motherName === 'string' ? motherName.trim() : '';
        rollNo = typeof rollNo === 'string' ? rollNo.trim().toUpperCase() : '';
        address = typeof address === 'string' ? address.trim() : '';
        phoneNo = typeof phoneNo === 'string' ? phoneNo.trim() : '';

        // Validation - Check if all mandatory fields are provided
        if (!name || !fatherName || !motherName || !rollNo || !address || !phoneNo) {
            return res.status(400).json({
                success: false,
                message: 'Kripya sabhi fields (name, fatherName, motherName, rollNo, address, phoneNo) bharein.'
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
            motherName,
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
        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: 'Yeh Roll No pehle se registered hai.'
            });
        }

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

// @desc    Get all registered users (supports ?search=query)
// @route   GET /api/users
// @access  Public
const getUsers = async (req, res) => {
    try {
        const { search } = req.query;
        let query = {};

        if (search && search.trim() !== '') {
            const searchRegex = new RegExp(search.trim(), 'i');
            query = {
                $or: [
                    { name: searchRegex },
                    { rollNo: searchRegex },
                    { fatherName: searchRegex },
                    { phoneNo: searchRegex }
                ]
            };
        }

        const users = await User.find(query).sort({ createdAt: -1 });
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

// @desc    Get single user by MongoDB ID or Roll No
// @route   GET /api/users/:id
// @access  Public
const getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        let user;

        if (mongoose.Types.ObjectId.isValid(id)) {
            user = await User.findById(id);
        }

        if (!user) {
            // Search by Roll No if ID is not ObjectId or not found
            user = await User.findOne({ rollNo: id.toUpperCase() });
        }

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Student record nahi mila.'
            });
        }

        return res.status(200).json({
            success: true,
            data: user
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Server error occurred',
            error: error.message
        });
    }
};

// @desc    Update a user record by ID
// @route   PUT /api/users/:id
// @access  Public
const updateUser = async (req, res) => {
    try {
        const { id } = req.params;

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

        let { name, fatherName, motherName, rollNo, address, phoneNo } = req.body;

        if (rollNo && rollNo.trim().toUpperCase() !== user.rollNo) {
            const existingRoll = await User.findOne({ rollNo: rollNo.trim().toUpperCase() });
            if (existingRoll) {
                return res.status(400).json({
                    success: false,
                    message: 'Yeh Roll No kisi aur student ke paas hai.'
                });
            }
            user.rollNo = rollNo.trim().toUpperCase();
        }

        if (name) user.name = name.trim();
        if (fatherName) user.fatherName = fatherName.trim();
        if (motherName) user.motherName = motherName.trim();
        if (address) user.address = address.trim();
        if (phoneNo) user.phoneNo = phoneNo.trim();

        const updatedUser = await user.save();

        return res.status(200).json({
            success: true,
            message: 'Student details safaltapurvak update ho gayi hain!',
            data: updatedUser
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

// @desc    Get Student Statistics
// @route   GET /api/users/stats
// @access  Public
const getStats = async (req, res) => {
    try {
        const totalStudents = await User.countDocuments();
        return res.status(200).json({
            success: true,
            data: {
                totalStudents,
                serverStatus: 'Active',
                timestamp: new Date()
            }
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
    getUserById,
    updateUser,
    deleteUser,
    getStats
};
