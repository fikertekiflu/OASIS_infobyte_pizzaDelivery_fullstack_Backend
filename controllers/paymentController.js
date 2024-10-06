const Order = require('../models/Order');
const Inventory = require('../models/Inventory');
const nodemailer = require('nodemailer');

// Mock Payment Controller
exports.mockPayment = async (req, res) => {
    const { userId, pizzas, totalAmount, deliveryAddress } = req.body;
    // Debugging log to check the received data
    console.log('Received payment data:', req.body);

    // Validate required fields
    if (!userId || !totalAmount || !pizzas || pizzas.length === 0 || !deliveryAddress) {
        console.error('Missing required fields:', { userId, totalAmount, pizzas, deliveryAddress });
        return res.status(400).send({ error: 'Missing required fields.' });
    }

    try {
        // Create a new order
        const newOrder = new Order({
            userId,
            pizzas,
            totalAmount,
            deliveryAddress,
            status: 'received',
        });

        await newOrder.save();

        // Find or create an inventory document
        let inventory = await Inventory.findOne();

        // If no inventory exists, create one with default values
        if (!inventory) {
            console.log('No inventory found. Creating new inventory document.');
            inventory = new Inventory({
                base: 100,  // Default base stock, adjust this value based on your needs
                sauce: 100,  // Default sauce stock, adjust as necessary
                threshold: 10,  // Set the threshold for low stock alerts
            });
            await inventory.save();
        }

        // Update inventory based on the pizzas ordered
        inventory.base -= pizzas.length;
        inventory.sauce -= pizzas.length;  // Assuming 1 pizza uses 1 base and 1 sauce, adjust logic as needed

        // Check if inventory is below the threshold and send an email alert
        if (inventory.base < inventory.threshold) {
            sendStockNotificationEmail('admin@example.com', 'Pizza base stock is low!');
        }

        // Save the updated inventory
        await inventory.save();

        // Respond to the client with success
        res.status(200).send({ message: 'Payment successful!', orderId: newOrder._id });
    } catch (error) {
        console.error('Error during payment processing:', error);
        res.status(500).send({ error: 'Payment failed.' });
    }
};

// Email notification function for low stock
const sendStockNotificationEmail = (adminEmail, message) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: adminEmail,
        subject: 'Inventory Stock Alert',
        text: message,
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending email:', error);
        } else {
            console.log('Email sent:', info.response);
        }
    });
};
