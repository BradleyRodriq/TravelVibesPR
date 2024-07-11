const Experience = require('../models/experienceModel');
const mongoose = require('mongoose');

// Get a random experience
const randomExperience = async (req, res) => {
    try {
        // Step 1: Count the total number of documents in the collection
        const count = await Experience.countDocuments();

        if (count === 0) {
            return res.status(404).json({ error: 'No experiences found' });
        }

        // Step 2: Generate a random index within the range of document count
        const randomIndex = Math.floor(Math.random() * count);

        // Step 3: Use findOne with skip and limit to fetch a random document
        const randomExperience = await Experience.findOne().skip(randomIndex);

        res.status(200).json(randomExperience);
    } catch (error) {
        console.error('Failed to fetch random experience', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

module.exports = { randomExperience };
