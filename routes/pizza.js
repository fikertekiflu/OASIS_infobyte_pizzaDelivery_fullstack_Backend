const express = require('express');
const router = express.Router();
const pizzaController = require('../controllers/pizzaController');
const { authenticate } = require('../middleware/auth'); // Example middleware for auth

// Fetch all pizzas
router.get('/', pizzaController.getAllPizzas);

// Fetch a single pizza by ID
router.get('/:id', pizzaController.getPizzaById);

// Create a new pizza (admin only)
router.post('/', authenticate, pizzaController.createPizza);

// Update a pizza (admin only)
router.put('/:id', authenticate, pizzaController.updatePizza);

// Delete a pizza (admin only)
router.delete('/:id', authenticate, pizzaController.deletePizza);

module.exports = router;
