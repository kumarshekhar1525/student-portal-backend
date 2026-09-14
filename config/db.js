const mongoose = require('mongoose');
const dns = require('dns');

// Fix for Windows ECONNREFUSED querySrv error with MongoDB Atlas
try {
    dns.setServers(['8.8.8.8', '8.8.4.4']);
} catch (e) {
    // fallback if custom DNS set fails
}

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`❌ MongoDB Connection Error: ${error.message}`);
        console.error(`👉 IP Whitelist Check: MongoDB Atlas me "Network Access" -> "Add IP Address" -> "Allow Access from Anywhere (0.0.0.0/0)" add karein.`);
    }
};

module.exports = connectDB;

