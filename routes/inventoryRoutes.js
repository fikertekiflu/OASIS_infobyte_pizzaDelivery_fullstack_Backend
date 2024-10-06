const express = require('express');
const router = express.Router();
const { getInventory, updateInventory } = require('../controllers/inventoryController');

// Get current inventory
router.get('/', getInventory);

// Update inventory
router.put('/', updateInventory);

module.exports = router;
