const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Name mandatory hai'],
            trim: true
        },
        email: {
            type: String,
            required: [true, 'Email mandatory hai'],
            unique: true,
            lowercase: true,
            trim: true
        },
        password: {
            type: String,
            required: [true, 'Password mandatory hai'],
            minlength: 6,
            select: false
        },
        role: {
            type: String,
            enum: ['student', 'admin', 'staff'],
            default: 'student'
        },
        rollNo: {
            type: String,
            trim: true,
            uppercase: true
        },
        fatherName: {
            type: String,
            trim: true
        },
        motherName: {
            type: String,
            trim: true
        },
        address: {
            type: String,
            trim: true
        },
        phoneNo: {
            type: String,
            trim: true
        }
    },
    {
        timestamps: true
    }
);

// Password hashing before saving
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Match entered password with hashed password
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
