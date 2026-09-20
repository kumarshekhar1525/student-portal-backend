const mongoose = require('mongoose');

const authLogSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        email: String,
        action: {
            type: String,
            default: 'JWT Token Verification'
        },
        status: {
            type: String,
            enum: ['SUCCESS', 'FAILED'],
            default: 'SUCCESS'
        },
        ipAddress: {
            type: String,
            default: '127.0.0.1'
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('AuthLog', authLogSchema);
