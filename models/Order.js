const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  pizzas: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Pizza' }],
  status: { type: String, enum: ['received', 'in_kitchen', 'sent_to_delivery'], default: 'received' },
  totalAmount: { type: Number, required: true },
  deliveryAddress: {
    type: String, // Add delivery address here
    required: true
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Order', orderSchema);
