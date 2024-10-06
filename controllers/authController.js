// Require necessary libraries
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const User = require('../models/User'); // Importing User model

// Register a new user
const register = async (req, res) => {
    const { username, email, password, role } = req.body;
    try {
        // Check if email is already registered
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already registered' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            username,
            email,
            password: hashedPassword,
            role: role || 'user',
        });

        await newUser.save();

        // Send verification email (commented out)
        // const verificationToken = crypto.randomBytes(20).toString('hex');
        // newUser.emailVerificationToken = verificationToken;
        // newUser.emailVerificationTokenExpires = Date.now() + 3600000; // 1 hour

        res.status(201).json({ message: 'User registered. Check your email for verification.' });
    } catch (error) {
        res.status(500).json({ message: 'Registration failed', error: error.message });
    }
};

// Email verification
const verifyEmail = async (req, res) => {
    const { token } = req.query;
    try {
        const user = await User.findOne({
            emailVerificationToken: token,
            emailVerificationTokenExpires: { $gt: Date.now() },
        });
        if (!user) return res.status(400).json({ message: 'Token is invalid or has expired' });

        user.emailVerified = true;
        user.emailVerificationToken = undefined;
        user.emailVerificationTokenExpires = undefined;
        await user.save();

        res.status(200).json({ message: 'Email verified successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Verification failed', error: error.message });
    }
};

// Login
const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        // Optionally check if the email is verified
        // if (!user.emailVerified) {
        //     return res.status(400).json({ message: 'Email not verified' });
        // }

        const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
        
        // Return the token, user ID, username, and role
        res.json({
            token,
            userID: user._id,
            username: user.username,
            role: user.role // Include the user's role in the response
        });
    } catch (error) {
        res.status(500).json({ message: 'Login failed', error: error.message });
    }
};


// Reset password request
const requestPasswordReset = async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: 'User not found' });

        const resetToken = crypto.randomBytes(20).toString('hex');
        user.passwordResetToken = resetToken;
        user.passwordResetTokenExpires = Date.now() + 3600000; // 1 hour

        await user.save();

        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
        });
        const mailOptions = {
            to: user.email,
            from: 'yourapp@example.com',
            subject: 'Password Reset',
            text: `Click here to reset your password: http://${process.env.HOST}/reset-password?token=${resetToken}`,
        };
        await transporter.sendMail(mailOptions);

        res.status(200).json({ message: 'Password reset email sent' });
    } catch (error) {
        res.status(500).json({ message: 'Password reset request failed', error: error.message });
    }
};

// Reset password
const resetPassword = async (req, res) => {
    const { token, newPassword } = req.body;
    try {
        const user = await User.findOne({
            passwordResetToken: token,
            passwordResetTokenExpires: { $gt: Date.now() },
        });
        if (!user) return res.status(400).json({ message: 'Token is invalid or expired' });

        user.password = await bcrypt.hash(newPassword, 10);
        user.passwordResetToken = undefined;
        user.passwordResetTokenExpires = undefined;

        await user.save();
        res.status(200).json({ message: 'Password reset successful' });
    } catch (error) {
        res.status(500).json({ message: 'Password reset failed', error: error.message });
    }
};

module.exports = {
    register,
    verifyEmail,
    login,
    requestPasswordReset,
    resetPassword,
};
