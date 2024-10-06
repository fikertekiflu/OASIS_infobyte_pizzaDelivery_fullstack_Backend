const mongoose = require('mongoose');

const pizzaSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    base: { type: String, required: true },
    sauce: { type: String, required: true },
    cheese: { type: String, required: true },
    veggies: { type: [String], required: true },
    meat: { type: [String], default: [] },
    price: { type: Number, required: true },
    stock: { type: Number, required: true, default: 100 },
    image: { type: String, required: true },
    availableBases: { type: [String], required: true },      // New field
    availableSauces: { type: [String], required: true },    // New field
    availableCheeses: { type: [String], required: true },   // New field
    availableVeggies: { type: [String], required: true },    // New field
});

module.exports = mongoose.model('Pizza', pizzaSchema);
