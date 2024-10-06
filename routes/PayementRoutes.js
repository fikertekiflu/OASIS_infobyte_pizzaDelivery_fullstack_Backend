const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');

// Mock payment route
router.post('/payment/mock-payment', paymentController.mockPayment);

module.exports = router;
                           