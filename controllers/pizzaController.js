const Pizza = require('../models/Pizza');

// Get all pizzas
exports.getAllPizzas = async (req, res) => {
    try {
        const pizzas = await Pizza.find();
        res.json(pizzas);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get pizza by ID
exports.getPizzaById = async (req, res) => {
    try {
        const pizza = await Pizza.findById(req.params.id);
        if (!pizza) return res.status(404).json({ message: 'Pizza not found' });
        res.json(pizza);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create a new pizza
exports.createPizza = async (req, res) => {
    const { name, description, base, sauce, cheese, veggies, meat, price, stock } = req.body;
    const pizza = new Pizza({ name, description, base, sauce, cheese, veggies, meat, price, stock });
    try {
        const savedPizza = await pizza.save();
        res.status(201).json(savedPizza);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Update a pizza
exports.updatePizza = async (req, res) => {
    try {
        const pizza = await Pizza.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!pizza) return res.status(404).json({ message: 'Pizza not found' });
        res.json(pizza);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete a pizza
exports.deletePizza = async (req, res) => {
    try {
        const pizza = await Pizza.findByIdAndDelete(req.params.id);
        if (!pizza) return res.status(404).json({ message: 'Pizza not found' });
        res.json({ message: 'Pizza deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
