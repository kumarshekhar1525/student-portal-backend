const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        userName: {
            type: String
        },
        userRole: {
            type: String
        },
        comment: {
            type: String,
            required: [true, 'Comment content is required'],
            trim: true
        }
    },
    {
        timestamps: true
    }
);

const complaintSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, 'Complaint title is required'],
            trim: true
        },
        description: {
            type: String,
            required: [true, 'Complaint description is required'],
            trim: true
        },
        category: {
            type: String,
            enum: ['Academic', 'Hostel', 'Infrastructure', 'Finance', 'General'],
            default: 'General'
        },
        priority: {
            type: String,
            enum: ['Low', 'Medium', 'High', 'Urgent'],
            default: 'Medium'
        },
        status: {
            type: String,
            enum: ['Pending', 'In Progress', 'Resolved', 'Rejected'],
            default: 'Pending'
        },
        student: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        assignedTo: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            default: null
        },
        comments: [commentSchema]
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('Complaint', complaintSchema);
