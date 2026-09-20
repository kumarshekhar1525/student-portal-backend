const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Complaint = require('./models/Complaint');
const Item = require('./models/Item');
const AuthLog = require('./models/AuthLog');
const ErrorLog = require('./models/ErrorLog');
const RoleLog = require('./models/RoleLog');
const UploadLog = require('./models/UploadLog');
const connectDB = require('./config/db');

dotenv.config();

const seedData = async () => {
    try {
        await connectDB();

        console.log('🗑️ Existing data cleaning...');
        await User.deleteMany();
        await Complaint.deleteMany();
        await Item.deleteMany();
        await AuthLog.deleteMany();
        await ErrorLog.deleteMany();
        await RoleLog.deleteMany();
        await UploadLog.deleteMany();

        console.log('📝 Creating Admin & Staff users...');
        const adminUser = await User.create({
            name: 'Admin User',
            email: 'admin@example.com',
            password: 'adminpassword123',
            role: 'admin',
            rollNo: 'ADM001'
        });

        // 👑 NAYA ADMIN ACCOUNT HERE:
        const shekharAdmin = await User.create({
            name: 'Shekhar Admin',
            email: 'shekhar.admin@example.com',
            password: 'adminpassword123',
            role: 'admin',
            rollNo: 'ADM002'
        });

        const staffUser = await User.create({
            name: 'Staff Member',
            email: 'staff@example.com',
            password: 'staffpassword123',
            role: 'staff',
            rollNo: 'STF001'
        });

        console.log('👥 Creating 5 Student users...');
        const studentsData = [
            {
                name: 'Shekhar Yadav',
                email: 'shekhar@gmail.com',
                password: 'password123',
                role: 'student',
                rollNo: '2026CS150',
                phoneNo: '9931000000',
                address: 'Patna, Bihar'
            },
            {
                name: 'rohit Sharma',
                email: 'aarav@gmail.com',
                password: 'password123',
                role: 'student',
                rollNo: '2026CS101',
                phoneNo: '9876543210',
                address: 'Delhi, India'
            },
            {
                name: 'Priya Singh',
                email: 'priya@gmail.com',
                password: 'password123',
                role: 'student',
                rollNo: '2026CS102',
                phoneNo: '9812345678',
                address: 'Varanasi, UP'
            },
            {
                name: 'Rohan Verma',
                email: 'rohan@gmail.com',
                password: 'password123',
                role: 'student',
                rollNo: '2026CS103',
                phoneNo: '9765432109',
                address: 'Lucknow, UP'
            },
            {
                name: 'Ananya Patel',
                email: 'ananya@gmail.com',
                password: 'password123',
                role: 'student',
                rollNo: '2026CS104',
                phoneNo: '9654321098',
                address: 'Ahmedabad, Gujarat'
            }
        ];

        const createdStudents = await User.insertMany(studentsData);

        console.log('📋 Creating sample complaints...');
        await Complaint.create({
            title: 'Hostel Wi-Fi not working',
            description: 'The Wi-Fi in Block B 3rd floor has been down for 2 days.',
            category: 'Infrastructure',
            priority: 'High',
            status: 'Pending',
            student: createdStudents[0]._id,
            comments: [
                {
                    user: createdStudents[0]._id,
                    userName: createdStudents[0].name,
                    userRole: createdStudents[0].role,
                    comment: 'Please resolve this urgently as exams are near.'
                }
            ]
        });

        await Complaint.create({
            title: 'Library AC Noise Issue',
            description: 'The AC unit in Reading Room 2 is making a loud noise.',
            category: 'Infrastructure',
            priority: 'Low',
            status: 'In Progress',
            student: createdStudents[1]._id,
            assignedTo: staffUser._id
        });

        console.log('📦 Creating sample lost & found items...');
        await Item.create({
            title: 'sonata Smartwatch',
            description: 'Black strap smartwatch found in Gym',
            category: 'Electronics',
            status: 'Found',
            location: 'Campus Sports Gym',
            postedBy: createdStudents[0]._id,
            contactPhone: '9931000000'
        });

        await Item.create({
            title: 'Fastrack Smartwatch',
            description: 'Black strap smartwatch found in Gym',
            category: 'Electronics',
            status: 'Found',
            location: 'Campus Sports Gym',
            postedBy: createdStudents[0]._id,
            contactPhone: '9931000000'
        });

        await Item.create({
            title: 'Blue Water Bottle',
            description: 'Milton stainless steel water bottle found near Library.',
            category: 'Other',
            status: 'Found',
            location: 'Central Library Hall',
            postedBy: createdStudents[0]._id,
            contactPhone: '9931000000'
        });

        console.log('🔐 Creating Auth Logs (authMiddleware)...');
        await AuthLog.create({
            user: createdStudents[0]._id,
            email: createdStudents[0].email,
            action: 'User Login & Bearer Token Verification',
            status: 'SUCCESS',
            ipAddress: '127.0.0.1'
        });

        console.log('🛡️ Creating Role Logs (roleMiddleware)...');
        await RoleLog.create({
            user: adminUser._id,
            userName: adminUser.name,
            userRole: adminUser.role,
            requiredRoles: ['admin', 'staff'],
            accessedRoute: '/api/complaints/stats',
            accessGranted: true
        });

        console.log('📁 Creating Upload Logs (uploadMiddleware)...');
        await UploadLog.create({
            fileName: 'image-1726840000.jpg',
            filePath: '/uploads/image-1726840000.jpg',
            fileSize: '1.2 MB',
            uploadedBy: createdStudents[0]._id,
            mimeType: 'image/jpeg'
        });

        console.log('⚠️ Creating Error Logs (errorMiddleware)...');
        await ErrorLog.create({
            statusCode: 404,
            message: 'Resource not found with id of 66a1234567890',
            route: '/api/complaints/invalidid',
            method: 'GET',
            stack: 'Error: Resource not found\n    at complaintController.js:85'
        });

        console.log('\n==================================================');
        console.log('🎉 ALL TABLES & ADMIN USERS SEEDED SUCCESSFULLY!');
        console.log('==================================================\n');

        studentsData.forEach((s, idx) => {
            console.log(`👤 Student ${idx + 1}: ${s.name} (${s.rollNo}) | Email: ${s.email} | Pass: ${s.password}`);
        });

        console.log('\n🔑 Admin 1: admin@example.com | Pass: adminpassword123');
        console.log(`🔑 Admin 2: ${shekharAdmin.email} | Pass: adminpassword123`);
        console.log('🔑 Staff Email: staff@example.com | Pass: staffpassword123');
        console.log('==================================================\n');

        process.exit();
    } catch (error) {
        console.error('❌ Error inserting seed data:', error);
        process.exit(1);
    }
};

seedData();
