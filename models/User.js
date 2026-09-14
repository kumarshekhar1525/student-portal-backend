const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Name mandatory hai'],
            trim: true
        },
        fatherName: {
            type: String,
            required: [true, 'Father name mandatory hai'],
            trim: true
        },
        motherName: {
            type: String,
            required: [true, 'Mother name mandatory hai'],
            trim: true
        },
        rollNo: {
            type: String,
            required: [true, 'Roll No mandatory hai'],
            unique: true,
            trim: true,
            uppercase: true
        },
        address: {
            type: String,
            required: [true, 'Address mandatory hai'],
            trim: true
        },
        phoneNo: {
            type: String,
            required: [true, 'Phone number mandatory hai'],
            trim: true
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('User', userSchema);
