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
const getVibebyId = async (req, res) => {
    try {
        const { vibeId } = req.params;
        const vibe = await Vibe.findById(vibeId);
        if (!vibe) {
            return res.status(404).json({ error: 'Vibe not found' });
        }
        res.json(vibe.name);
    } catch (error) {
        console.error('Failed to fetch vibe:', error);
        res.status(500).json({ error: 'Failed to fetch vibe' });
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

const batchFetchVibes = async (req, res) => {
    const { vibeIds } = req.body;
    try {
        const vibes = await Vibe.find({ _id: { $in: vibeIds } });
        const vibeNames = vibes.map(vibe => vibe.name);
        res.json(vibeNames);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch vibes' });
    }
};

module.exports = { getVibes, createVibe, deleteVibe, getVibebyId, batchFetchVibes };
