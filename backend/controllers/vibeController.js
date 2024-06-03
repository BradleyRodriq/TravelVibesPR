const Vibe = require('../models/vibeModel');

// Get all vibes
const getVibes = async (req, res) => {
    try {
        const vibes = await Vibe.find().sort({ createdAt: -1 });
        res.json(vibes);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }

}
// Get a single vibe
const getVibe = async (req, res) => {
    const { id } = req.params;

    try {
        const vibe = await Vibe.findById(id);
        if (!vibe) {
            return res.status(404).json({ success: false, error: 'Vibe not found' });
        }
        res.status(200).json({ success: true, data: vibe });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

// Create a new vibe
const createVibe = async (req, res) => {
    const { name } = req.body;

    try {
        const vibe = await Vibe.create({ name });
        res.status(201).json({ success: true, data: vibe });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

// Update a vibe
const updateVibe = async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;

    try {
        const vibe = await Vibe.findByIdAndUpdate(id, { name }, { new: true, runValidators: true });
        if (!vibe) {
            return res.status(404).json({ success: false, error: 'Vibe not found' });
        }
        res.status(200).json({ success: true, data: vibe });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

// Delete a vibe
const deleteVibe = async (req, res) => {
    const { id } = req.params;

    try {
        const vibe = await Vibe.findByIdAndDelete(id);
        if (!vibe) {
            return res.status(404).json({ success: false, error: 'Vibe not found' });
        }
        res.status(200).json({ success: true, message: 'Vibe deleted successfully' });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

module.exports = {
    getVibes,
    getVibe,
    createVibe,
    updateVibe,
    deleteVibe
};
