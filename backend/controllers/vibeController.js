const Vibe = require('../models/vibeModel');

// GET all vibes
const getVibes = async (req, res) => {
    try {
        const vibes = await Vibe.find();
        res.status(200).json(vibes);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// GET all vibes
const getVibesbyId = async (req, res) => {
    try {
        const vibes = await Vibe.find().select('_id');
        res.status(200).json(vibes);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// POST a vibe
const createVibe = async (req, res) => {
    const { name } = req.body;
    try {
        const vibe = new Vibe({ name });
        await vibe.save();
        res.status(201).json(vibe);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// DELETE a vibe
const deleteVibe = async (req, res) => {
    const { id } = req.params;
    try {
        const vibe = await Vibe.findByIdAndDelete(id);
        if (!vibe) {
            return res.status(404).json({ error: 'Vibe not found' });
        }
        res.status(200).json(vibe);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

module.exports = { getVibes, createVibe, deleteVibe, getVibesbyId };
