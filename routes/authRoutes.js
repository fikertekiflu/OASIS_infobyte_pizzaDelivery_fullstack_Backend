const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Route for user registration
router.post('/register', authController.register);

// Route for user login
router.post('/login', authController.login);

// Route for email verification
router.get('/verify-email', authController.verifyEmail);

// Route to request a password reset
router.post('/request-password-reset', authController.requestPasswordReset);

// Route to reset the password
router.post('/reset-password', authController.resetPassword);

module.exports = router;
