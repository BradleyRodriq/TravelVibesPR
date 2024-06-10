const Experience = require('../models/experienceModel');
const mongoose = require('mongoose');
const axios = require('axios');

// get all experiences
const getExperiences = async (req, res) => {
    try {
        let experiences;
        if (req.user) {
            const user = req.user;
            experiences = await Experience.aggregate([
                {
                    $addFields: {
                        vibeMatches: {
                            $size: { $setIntersection: [ "$vibes", user.vibes ] }
                        }
                    }
                },
                {
                    $sort: { vibeMatches: -1, createdAt: -1 }
                }
            ]);
        } else {
            experiences = await Experience.find().sort({ createdAt: -1 });
        }
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
    const { name, location, vibes } = req.body;

    let emptyFields = [];

    if (!name) {
        emptyFields.push('name');
    }

    if (!location) {
        emptyFields.push('location');
    }

    if (!vibes) {
        emptyFields.push('vibes');
    }

    if (emptyFields.length > 0) {
        return res.status(400).json({ error: 'Please fill in all the fields', emptyFields });
    }

    try {
        const experience = await Experience.create({ name, location, vibes });
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

// Fetch and create experiences from Google Places API
const fetchAndCreateExperiences = async (req, res) => {
    const apiKey = process.env.GOOGLE_API_KEY || 'AIzaSyBujBsbZxD36wyEQZILa_ky0y15X_lyuQM';
    const location = '18.2208,-66.5901'; // Latitude and longitude for PR
    const radius = 50000; // 50 km
    const types = [];

    const endpoint = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json';
    const filteredPlaces = [];

    async function fetchPlaces(pageToken = '') {
        try {
            const params = {
                key: apiKey,
                location: location,
                radius: radius,
                type: types.join('|'),
                pagetoken: pageToken
            };

            const response = await axios.get(endpoint, { params });
            const places = response.data.results;

            // Filter places with a rating of more than 3 stars
            const validPlaces = places
                .filter(place => place.rating > 3)
                .map(place => ({
                    name: place.name,
                    location: `${place.address_components.long_name}`
                }));

            filteredPlaces.push(...validPlaces);

            // Check if there is a next page token
            if (response.data.next_page_token) {
                // Delay for a short time to handle the next_page_token propagation
                await new Promise(resolve => setTimeout(resolve, 2000));
                await fetchPlaces(response.data.next_page_token);
            }
        } catch (error) {
            console.error('Error fetching nearby places:', error);
            throw error;
        }
    }

    try {
        await fetchPlaces();

        // Create experience objects
        const createdExperiences = [];
        for (const place of filteredPlaces) {
            const experience = await createExperience({ name: place.name, location: place.location, vibes: [] });
            createdExperiences.push(experience);
        }

        res.status(200).json(createdExperiences);
    } catch (error) {
        res.status(500).send('Server Error');
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
    updateExperience,
    fetchAndCreateExperiences
};
