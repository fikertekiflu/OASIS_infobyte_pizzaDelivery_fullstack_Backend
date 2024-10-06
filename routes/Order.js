const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

// GET all orders
router.get('/', orderController.getAllOrders); // Ensure this function exists in your controller

// POST to place an order
router.post('/', orderController.placeOrder);

// PUT to update order status
router.put('/:id/status', orderController.updateOrderStatus);

module.exports = router;
