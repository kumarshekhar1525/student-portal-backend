const express = require('express');
const router = express.Router();
const {
    registerUser,
    getUsers,
    getUserById,
    updateUser,
    deleteUser,
    getStats
} = require('../controllers/userController');

// Route for system/student stats summary
router.get('/stats', getStats);

// Route for student registration
router.post('/register', registerUser);

// Route for fetching all records (supports ?search=query)
router.get('/', getUsers);

// Route for fetching single student record by ID or Roll No
router.get('/:id', getUserById);

// Route for updating student details by ID
router.put('/:id', updateUser);

// Route for deleting a student record by ID
router.delete('/:id', deleteUser);

module.exports = router;
