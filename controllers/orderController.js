const Inventory = require('../models/Inventory');
const Order = require('../models/Order');

exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find(); // Assuming you are using Mongoose
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch orders.' });
  }
};
// Place an order and update inventory
exports.placeOrder = async (req, res) => {
  const { pizzas, totalAmount, deliveryAddress } = req.body;

  try {
    const inventory = await Inventory.findOne();
    if (!inventory) {
      return res.status(400).json({ error: 'Inventory not available.' });
    }

    // Check stock
    let stockAvailable = true;
    pizzas.forEach(pizza => {
      if (inventory.base < 1 || inventory.sauce < 1 || inventory.cheese < 1) {
        stockAvailable = false;
      }
    });

    if (!stockAvailable) {
      return res.status(400).json({ error: 'Not enough stock.' });
    }

    // Deduct from inventory
    inventory.base -= pizzas.length;
    inventory.sauce -= pizzas.length;
    inventory.cheese -= pizzas.length;
    // Assuming meat is also included in each pizza
    inventory.meat -= pizzas.length; 

    await inventory.save();

    // Create the order
    const order = new Order({
      pizzas,
      totalAmount,
      deliveryAddress,
      status: 'Order received',
      userId: req.userId  // Assuming user is logged in
    });

    await order.save();

    // Check if stock is below threshold
    if (inventory.base < inventory.threshold || inventory.sauce < inventory.threshold || inventory.cheese < inventory.threshold) {
      sendNotificationToAdmin();
    }

    res.status(201).json({ message: 'Order placed successfully!' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to process order.' });
  }
};

// Update order status
exports.updateOrderStatus = async (req, res) => {
  const { status } = req.body;

  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ error: 'Order not found.' });
    }

    order.status = status;
    await order.save();

    res.status(200).json({ message: 'Order status updated.' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update order status.' });
  }
};
