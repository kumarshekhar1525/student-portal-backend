const ErrorLog = require('../models/ErrorLog');

const errorHandler = (err, req, res, next) => {
    let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    let message = err.message || 'Server Error';

    // Log to errorlogs collection in MongoDB
    ErrorLog.create({
        statusCode,
        message,
        route: req.originalUrl,
        method: req.method,
        stack: err.stack
    }).catch(() => {});

    res.status(statusCode).json({
        success: false,
        message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack
    });
};

module.exports = errorHandler;
