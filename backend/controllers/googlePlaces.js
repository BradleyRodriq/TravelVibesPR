const Experience = require('../models/experienceModel');
const axios = require('axios');

const fetchAndCreateExperiences = async (req, res) => {
    const apiKey = process.env.GOOGLE_PLACES_API_KEY;
    const location = '18.2208,-66.5901'; // Latitude and longitude for PR
    const radius = 5000; // 5 km
    const types = ['tourist_attraction']; // Only tourist attractions

    const API_ENDPOINT = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json';

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

            const response = await axios.get(API_ENDPOINT, { params });
            const places = response.data.results;
            console.log('Fetched places:', places);

            // Filter places with a rating of more than 3 stars
            const validPlaces = places
                .filter(place => place.rating > 3)
                .map(place => ({
                    name: place.name,
                    location: place.vicinity // Use place.vicinity or another suitable property for location
                }));

            filteredPlaces.push(...validPlaces);
            console.log('Filtered places:', filteredPlaces);

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

        const createdExperiences = await createFetchedExperiences(filteredPlaces);
        console.log('Created experiences:', createdExperiences);
        res.status(200).json(createdExperiences);
    } catch (error) {
        console.error('Server Error:', error);
        res.status(500).send('Server Error');
    }
};

const createFetchedExperiences = async (places) => {
    try {
        const createdExperiences = [];
        for (const place of places) {
            const experience = new Experience({ name: place.name, location: place.location, vibes: [] });
            await experience.save();
            createdExperiences.push(experience);
        }
        return createdExperiences;
    } catch (error) {
        console.error('Error creating experiences:', error);
        throw error;
    }
};

module.exports = { fetchAndCreateExperiences, createFetchedExperiences };
