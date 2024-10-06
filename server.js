const express = require('express');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes')
const cors = require('cors')
const pizzaRoutes = require('./routes/pizza');
const paymentRoutes = require('./routes/PayementRoutes');
const inventoryRoutes = require('./routes/inventoryRoutes');
const orderRoutes = require('./routes/Order');


// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

app.use(cors());
// Middleware
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/pizzas', pizzaRoutes);
app.use('/api', paymentRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/orders', orderRoutes);
// Import and connect to MongoDB
const connectDB = require('./config/db');
connectDB();
// Import models
require('./models/User');
require('./models/Pizza');
require('./models/Order');
require('./models/Inventory');






const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
