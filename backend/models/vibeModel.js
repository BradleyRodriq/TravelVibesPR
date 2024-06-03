const mongoose = require('mongoose');

// Define a schema for the vibe
const vibeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    }
});

// Create a model using the schema
const Vibe = mongoose.model('Vibe', vibeSchema);

module.exports = Vibe;
