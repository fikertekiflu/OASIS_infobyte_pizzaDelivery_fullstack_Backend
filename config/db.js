// config.js

const mongoose = require('mongoose');
require('dotenv').config(); // to use environment variables from .env file

const connectDB = async () => {
  try {
    const conn = await mongoose.connect('mongodb://localhost:27017/Deliverypizza', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1); // Exit process with failure
  }
};

module.exports = connectDB;
