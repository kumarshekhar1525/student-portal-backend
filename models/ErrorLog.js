const mongoose = require('mongoose');

const errorLogSchema = new mongoose.Schema(
    {
        statusCode: {
            type: Number,
            default: 500
        },
        message: {
            type: String,
            required: true
        },
        route: String,
        method: String,
        stack: String
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('ErrorLog', errorLogSchema);
