// middleware/auth.js

const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authenticate = async (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1]; // Assuming Bearer token
    if (!token) return res.status(403).json({ message: 'No token provided' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // Use your secret key
        req.user = await User.findById(decoded.id);
        next();
    } catch (error) {
        res.status(401).json({ message: 'Unauthorized' });
    }
};

const authorizeAdmin = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied, admin only' });
    }
    next();
};

module.exports = { authenticate, authorizeAdmin };
