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
    const userId = req.user._id; // Assuming req.user contains the authenticated user's information

    try {
        // Validate vibes array
        if (!Array.isArray(vibes) || vibes.length === 0) {
            return res.status(400).json({ error: 'Invalid vibes data.' });
        }

        // Check if all provided vibes exist
        const foundVibes = await Vibe.find({ _id: { $in: vibes } });
        if (foundVibes.length !== vibes.length) {
            return res.status(404).json({ error: 'Some vibes were not found.' });
        }

        // Add vibes to the user's vibes array
        const user = await User.findById(userId);
        user.vibes = [...new Set([...user.vibes, ...vibes])];
        await user.save();

        res.status(200).json({ vibes: user.vibes });
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while adding vibes.' });
    }
};

// Delete vibes from user
const deleteUserVibes = async (req, res) => {
    const { user } = req;
    const { vibeId } = req.params;

    // Check if vibeId is provided and is a valid ObjectId
    if (!vibeId || !mongoose.Types.ObjectId.isValid(vibeId)) {
        return res.status(400).json({ error: 'Invalid or missing vibeId' });
    }

    try {
        const vibeToDeleteObjectId = mongoose.Types.ObjectId.createFromHexString(vibeId);

        user.vibes = user.vibes.filter(vibe => !vibe.equals(vibeToDeleteObjectId));
        await user.save();

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
        const user = await User.findById(req.user._id).populate('vibes'); // Populate vibes if necessary
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
