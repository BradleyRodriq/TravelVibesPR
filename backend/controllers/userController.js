const User = require('../models/userModel');
const jwt = require('jsonwebtoken');

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
    try {
        const updatedUser = await User.findByIdAndUpdate(req.user._id, { $push: { vibes: { $each: vibes } } }, { new: true });
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

module.exports = { loginUser, signupUser, addUserVibes, deleteUserVibes, deleteAllUserVibes };
