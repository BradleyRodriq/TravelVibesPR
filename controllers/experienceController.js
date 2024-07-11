const Experience = require('../models/experienceModel');
const mongoose = require('mongoose');
const User = require('../models/userModel');
const sendExperienceEmail = require('../nodemailer/nodemailerExperience');

// get all experiences
const getExperiences = async (req, res) => {
    try {
        const experiences = await Experience.find();
        res.status(200).json(experiences);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// get a single experience
const getExperience = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: 'No such experience' });
    }

    try {
        const experience = await Experience.findById(id);
        if (!experience) {
            return res.status(404).json({ error: 'No such experience' });
        }
        res.status(200).json(experience);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// create a single experience
const createExperience = async (req, res) => {
    const { name, location, vibes, pictureUrl } = req.body;

    let emptyFields = [];

    if (!name) {
        emptyFields.push('name');
    }

    if (!location) {
        emptyFields.push('location');
    }

    if (!pictureUrl) {
        emptyFields.push('pictureUrl');
    }
    if (!vibes) {
        emptyFields.push('vibes');
    }

    if (emptyFields.length > 0) {
        return res.status(400).json({ error: 'Please fill in all the fields', emptyFields });
    }

    try {
        const experience = await Experience.create({ name, location, vibes, pictureUrl });

         // Find users whose vibes match the experience vibes
         const matchingUsers = await User.find({ vibes: { $in: vibes } });

         // Send email to each matching user
         for (const user of matchingUsers) {
             await sendExperienceEmail(user);
         }

        res.status(200).json(experience);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// delete an experience
const deleteExperience = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: 'No such experience' });
    }

    try {
        const experience = await Experience.findOneAndDelete({ _id: id });
        if (!experience) {
            return res.status(404).json({ error: 'No such experience' });
        }
        const experiences = await Experience.find();
        res.status(200).json(experience);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// update an experience
const updateExperience = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: 'No such experience' });
    }

    try {
        const experience = await Experience.findByIdAndUpdate(id, req.body, { new: true });
        if (!experience) {
            return res.status(404).json({ error: 'No such experience' });
        }
        res.status(200).json(experience);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Add vibes to experience
const addExperienceVibes = async (req, res) => {
    const { id } = req.params;
    const { vibesToAdd } = req.body;

    try {
        const experience = await Experience.findById(id);

        if (!experience) {
            return res.status(404).json({ error: 'Experience not found' });
        }

        experience.vibes.push(...vibesToAdd); // Add new vibes to the experience's vibes array
        await experience.save();               // Save the updated experience document

        res.status(200).json({ experience });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Delete vibes from experience
const deleteExperienceVibes = async (req, res) => {
    const { id } = req.params;
    const { vibesToDelete } = req.body;

    try {
        const experience = await Experience.findById(id);

        if (!experience) {
            return res.status(404).json({ error: 'Experience not found' });
        }

        experience.vibes = experience.vibes.filter(vibe => !vibesToDelete.includes(vibe)); // Remove specified vibes from the experience's vibes array
        await experience.save();                                                         // Save the updated experience document

        res.status(200).json({ experience });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Delete all vibes from experience
const deleteAllExperienceVibes = async (req, res) => {
    const { id } = req.params;

    try {
        const experience = await Experience.findById(id);

        if (!experience) {
            return res.status(404).json({ error: 'Experience not found' });
        }

        experience.vibes = [];   // Clear the experience's vibes array
        await experience.save(); // Save the updated experience document

        res.status(200).json({ experience });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};






module.exports = {
    addExperienceVibes,
    deleteExperienceVibes,
    deleteAllExperienceVibes,
    createExperience,
    getExperience,
    getExperiences,
    deleteExperience,
    updateExperience
};
