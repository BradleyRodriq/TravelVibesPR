const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const Vibe = require('../models/vibeModel');

const createToken = (_id) => {
    return jwt.sign({ _id }, process.env.SECRET, { expiresIn: '3d' });
};

const loginUser = async(req, res) => {
    const {email, password} = req.body

    try {
        const user = await User.login(email, password)

        // create token
        const token = createToken(user._id)
        res.status(200).json({email, token})
    } catch (error) {
        res.status(400).json({error: error.message})
    }
}

// signup user
const signupUser = async(req, res) => {
    const {email, password} = req.body

    try {
        const user = await User.signup(email, password)

        // create token
        const token = createToken(user._id)
        res.status(200).json({email, token})
    } catch (error) {
        res.status(400).json({error: error.message})
    }
}

// Add vibes to user
const addUserVibes = async (req, res) => {
    const { vibes } = req.body;
    console.log('Request Body:', req.body);

    if (!Array.isArray(vibes)) {
        return res.status(400).json({ error: 'Vibes must be an array of strings.' });
    }

    try {
        // Fetch the vibe documents based on the provided vibe names or other identifiers
        const vibeDocs = await Vibe.find({ name: { $in: vibes } }); // Adjust according to your Vibe schema
        const vibeObjectIds = vibeDocs.map(vibe => vibe._id);

        const updatedUser = await User.findByIdAndUpdate(
            req.user._id,
            { $push: { vibes: { $each: vibeObjectIds } } },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ error: 'User not found.' });
        }

        console.log('Updated User:', updatedUser);
        res.status(200).json(updatedUser);
    } catch (error) {
        console.error('Error adding vibes:', error);
        res.status(400).json({ error: error.message });
    }
};


// Delete vibes from user
const deleteUserVibes = async (req, res) => {
    const { user } = req;
    const { vibesToDelete } = req.body;

    try {
        user.vibes = user.vibes.filter(vibe => !vibesToDelete.includes(vibe)); // Remove specified vibes from the user's vibes array
        await user.save();                                                     // Save the updated user document

        res.status(200).json({ user });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Delete all vibes from user
const deleteAllUserVibes = async (req, res) => {
    const { user } = req;

    try {
        user.vibes = [];   // Clear the user's vibes array
        await user.save(); // Save the updated user document

        res.status(200).json({ user });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Get all vibes for a user
const getUserVibes = async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.status(200).json({ vibes: user.vibes });
    } catch (error) {
        console.error('Error fetching user vibes:', error);
        res.status(500).json({ error: 'Failed to fetch user vibes' });
    }
};


module.exports = { loginUser, signupUser, addUserVibes, deleteUserVibes, deleteAllUserVibes, getUserVibes };
