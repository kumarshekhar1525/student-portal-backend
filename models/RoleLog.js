const mongoose = require('mongoose');

const roleLogSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        userName: String,
        userRole: String,
        requiredRoles: [String],
        accessedRoute: String,
        accessGranted: {
            type: Boolean,
            default: true
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('RoleLog', roleLogSchema);
