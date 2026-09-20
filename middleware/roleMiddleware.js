const RoleLog = require('../models/RoleLog');

// Custom Role-Based Access Control (RBAC) middleware
const authorize = (...roles) => {
    return async (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'Unauthorized access'
            });
        }

        const isAuthorized = roles.includes(req.user.role);

        // Record RBAC authorization log in rolelogs collection
        RoleLog.create({
            user: req.user._id,
            userName: req.user.name,
            userRole: req.user.role,
            requiredRoles: roles,
            accessedRoute: req.originalUrl,
            accessGranted: isAuthorized
        }).catch(() => {});

        if (!isAuthorized) {
            return res.status(403).json({
                success: false,
                message: `User role '${req.user.role}' is not authorized to access this route.`
            });
        }

        next();
    };
};

module.exports = { authorize };
