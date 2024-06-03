const User = require('../models/userModel');
const jwt = require('jsonwebtoken');

const createToken = (_id) => {
    return jwt.sign({ _id }, process.env.SECRET, { expiresIn: '3d' });
};

// login user
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.login(email, password);

        // create token
        const token = createToken(user._id);
        res.status(200).json({ email, token });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// signup user
const signupUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.signup(email, password);

        // create token
        const token = createToken(user._id);
        res.status(200).json({ email, token });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// change user vibes
const changeVibes = async (user, newVibes) => {
    try {
        user.vibes = newVibes;
        await user.save();
        return user;
    } catch (error) {
        throw new Error('Failed to change vibes');
    }
};

// add user vibes
const addVibes = async (user, vibesToAdd) => {
    try {
        user.vibes.push(...vibesToAdd);
        await user.save();
        return user;
    } catch (error) {
        throw new Error('Failed to add vibes');
    }
};

// edit user vibes
const editVibes = async (user, oldVibe, newVibe) => {
    const index = user.vibes.indexOf(oldVibe);
    if (index !== -1) {
        user.vibes[index] = newVibe;
        await user.save();
        return user;
    }
    throw new Error('Vibe not found');
};

// delete user vibes
const deleteVibes = async (user, vibesToDelete) => {
    user.vibes = user.vibes.filter(vibe => !vibesToDelete.includes(vibe));
    await user.save();
    return user;
};

// return user vibes to default
const returnVibesToDefault = async (user) => {
    user.vibes = [];
    await user.save();
    return user;
};

module.exports = { 
    loginUser, 
    signupUser,
    changeVibes, 
    addVibes, 
    editVibes, 
    deleteVibes, 
    returnVibesToDefault 
};
