const Experience = require('../models/experienceModel');
const mongoose = require('mongoose');

// Get a random experience
const randomExperience = async (req, res) => {
    try {
        // Use MongoDB's $sample aggregation for efficient random selection
        const randomExperiences = await Experience.aggregate([
            { $sample: { size: 1 } }
        ]);

        if (randomExperiences.length === 0) {
            return res.status(404).json({ error: 'No experiences found' });
        }

        res.status(200).json(randomExperiences[0]);
    } catch (error) {
        console.error('Failed to fetch random experience', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

module.exports = { randomExperience };
