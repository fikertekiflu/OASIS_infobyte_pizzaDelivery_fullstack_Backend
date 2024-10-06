const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema({
  base: { type: Number, default: 100 },    // Default stock
  sauce: { type: Number, default: 100 },
  cheese: { type: Number, default: 100 },
  veggies: { type: Number, default: 100 },
  meat: { type: Number, default: 100 },
  threshold: { type: Number, default: 20 }  // Threshold to trigger email notification
});

module.exports = mongoose.model('Inventory', inventorySchema);
