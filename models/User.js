const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'user'], default: 'user' },
  emailVerified: { type: Boolean, default: false },
  emailVerificationToken: String,
  emailVerificationTokenExpires: Date,
  passwordResetToken: String,
  passwordResetTokenExpires: Date
  // Add additional fields if needed
});

module.exports = mongoose.model('User', userSchema, 'users');
