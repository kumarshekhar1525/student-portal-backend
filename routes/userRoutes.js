const express = require('express');
const router = express.Router();
const { registerUser, getUsers, deleteUser } = require('../controllers/userController');

// Route for registration
router.post('/register', registerUser);

// Route for fetching all records
router.get('/', getUsers);

// Route for deleting a student record
router.delete('/:id', deleteUser);

module.exports = router;

