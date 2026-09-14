const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');

// Environment variables load karna
dotenv.config();

// Database connect karna
connectDB();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Serve static frontend form from public folder
app.use(express.static('public'));

// Routes setup
app.use('/api/users', userRoutes);

// 404 Handler for unknown API routes
app.use('/api/*', (req, res) => {
    res.status(404).json({
        success: false,
        message: 'API route not found'
    });
});

// Centralized Error Handling Middleware
app.use((err, req, res, next) => {
    console.error('Unhandled Error:', err.stack);
    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Internal Server Error'
    });
});

// Function to handle automatic port fallback if port is already in use
const startServer = (port) => {
    const server = app.listen(port, () => {
        console.log(`\n==================================================`);
        console.log(`🚀 Server is running on: http://localhost:${port}`);
        console.log(`==================================================\n`);
    });

    server.on('error', (err) => {
        if (err.code === 'EADDRINUSE') {
            console.log(`Port ${port} busy hai, port ${port + 1} par try kar rahe hain...`);
            startServer(port + 1);
        } else {
            console.error('Server error:', err);
        }
    });
};

const PORT = parseInt(process.env.PORT) || 5000;
startServer(PORT);
