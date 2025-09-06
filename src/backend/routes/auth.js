const express = require('express');
const router = express.Router();
const UserController = require('../controllers/userController');

// User registration route
router.post('/register', UserController.register);

// User login route
router.post('/login', UserController.login);

// User profile route
router.get('/profile', UserController.getProfile);

// Export the router
module.exports = router;