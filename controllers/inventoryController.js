const Inventory = require('../models/Inventory');
const nodemailer = require('nodemailer');

// Get current inventory
exports.getInventory = async (req, res) => {
  try {
    const inventory = await Inventory.findOne();
    if (!inventory) {
      return res.status(404).json({ error: 'Inventory not found.' });
    }
    res.status(200).json(inventory);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch inventory data.' });
  }
};

// Update inventory
exports.updateInventory = async (req, res) => {
  const { base, sauce, cheese, veggies, meat } = req.body;
  try {
    let inventory = await Inventory.findOne();
    if (!inventory) {
      inventory = new Inventory();
    }

    // Update inventory
    inventory.base = base;
    inventory.sauce = sauce;
    inventory.cheese = cheese;
    inventory.veggies = veggies;
    inventory.meat = meat;

    await inventory.save();
    res.status(200).json({ message: 'Inventory updated successfully!' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update inventory.' });
  }
};

// Function to send email notification when stock is below threshold
const sendNotificationToAdmin = () => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'your-email@gmail.com',
      pass: 'your-email-password'
    }
  });

  const mailOptions = {
    from: 'your-email@gmail.com',
    to: 'admin-email@example.com',
    subject: 'Inventory Stock Low',
    text: 'Inventory stock has fallen below the threshold. Please restock.'
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log('Error sending email:', error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
};
