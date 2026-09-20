const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const connectDB = require('./config/db');

// Route imports
const authRoutes = require('./routes/authRoutes');
const complaintRoutes = require('./routes/complaintRoutes');
const itemRoutes = require('./routes/itemRoutes');
const userRoutes = require('./routes/userRoutes');

// Error Middleware import
const errorHandler = require('./middleware/errorMiddleware');

// Environment variables configuration
dotenv.config();

// Connect Database
connectDB();

const app = express();

// Enable CORS and JSON parsing
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static uploaded files & frontend files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.static(path.join(__dirname, 'public')));

// Mount API Routes
app.use('/api/auth', authRoutes);
app.use('/api/complaints', complaintRoutes);
app.use('/api/items', itemRoutes);
app.use('/api/users', userRoutes);

// 404 Handler for unknown API routes
app.use('/api/*', (req, res) => {
    res.status(404).json({
        success: false,
        message: 'API route not found'
    });
});

// Centralized Error Handling Middleware
app.use(errorHandler);

// Function to handle automatic port fallback if port is already in use
const startServer = (port) => {
    const server = app.listen(port, () => {
        console.log(`\n==================================================`);
        console.log(`🚀 Server is running on: http://localhost:${port}`);
        console.log(`==================================================\n`);
    });

    server.on('error', (err) => {
        if (err.code === 'EADDRINUSE') {
            console.log(`Port ${port} busy, trying port ${port + 1}...`);
            startServer(port + 1);
        } else {
            console.error('Server error:', err);
        }
    });
};

const PORT = parseInt(process.env.PORT) || 5000;
startServer(PORT);
