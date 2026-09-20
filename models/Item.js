const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, 'Item title is required'],
            trim: true
        },
        description: {
            type: String,
            required: [true, 'Item description is required'],
            trim: true
        },
        category: {
            type: String,
            enum: ['Electronics', 'Books', 'ID Cards', 'Clothing', 'Keys', 'Other'],
            default: 'Other'
        },
        status: {
            type: String,
            enum: ['Lost', 'Found', 'Claimed'],
            default: 'Lost'
        },
        location: {
            type: String,
            required: [true, 'Location where item was lost/found is required'],
            trim: true
        },
        imageUrl: {
            type: String,
            default: ''
        },
        postedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        contactPhone: {
            type: String,
            trim: true
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('Item', itemSchema);
