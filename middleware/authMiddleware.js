const jwt = require('jsonwebtoken');
const User = require('../models/User');
const AuthLog = require('../models/AuthLog');

const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secretkey');

            req.user = await User.findById(decoded.id).select('-password');
            if (!req.user) {
                return res.status(401).json({
                    success: false,
                    message: 'User account not found'
                });
            }

            // Log authentication check to authlogs collection
            AuthLog.create({
                user: req.user._id,
                email: req.user.email,
                action: 'JWT Bearer Token Verification',
                status: 'SUCCESS',
                ipAddress: req.ip || '127.0.0.1'
            }).catch(() => {});

            return next();
        } catch (error) {
            console.error('JWT Auth Error:', error.message);
            return res.status(401).json({
                success: false,
                message: 'Not authorized, token failed or expired'
            });
        }
    }

    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'Not authorized, no bearer token provided'
        });
    }
};

module.exports = { protect };
