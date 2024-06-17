const Experience = require('../models/experienceModel');
const Vibe = require('../models/vibeModel');
const axios = require('axios');

const fetchAndCreateExperiences = async (req, res) => {
    const apiKey = process.env.GOOGLE_PLACES_API_KEY;
    const location = '18.2208,-66.5901'; // Latitude and longitude for PR
    const radius = 50000; // 50 km
    const types = ['tourist_attraction']; // Only tourist attractions

    const API_ENDPOINT = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json';
    const PLACE_DETAILS_ENDPOINT = 'https://maps.googleapis.com/maps/api/place/details/json';

    const filteredPlaces = []; // Define the array to store filtered places

    async function fetchPlaces(pageToken = '') {
        try {
            const params = {
                key: apiKey,
                location,
                radius,
                type: types.join('|'),
                pagetoken: pageToken
            };

            const response = await axios.get(API_ENDPOINT, { params });
            const places = response.data.results;
            console.log('Fetched places:', places);

            // Filter places with a rating of 3 stars or more
            const validPlaces = places.filter(place => place.rating >= 3);

            // Fetch details for each valid place to get reviews
            for (const place of validPlaces) {
                const details = await fetchPlaceDetails(place.place_id);
                if (details.reviews && details.reviews.length > 0) { // Check if reviews exist
                    const combinedReviews = details.reviews.map(review => review.text).join(' ');
                    const vibes = determineVibesFromReviews(combinedReviews);

                    if (vibes.length > 0) { // Only add place if there are matching vibes
                        filteredPlaces.push({
                            name: place.name,
                            location: place.vicinity || details.formatted_address, // Use place.vicinity or another suitable property for location
                            vibes
                        });
                    }
                }
            }

            console.log('Filtered places:', filteredPlaces);
            console.log('Valid places:', validPlaces.length);

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

    async function fetchPlaceDetails(placeId) {
        try {
            const params = {
                key: apiKey,
                place_id: placeId,
                fields: 'name,rating,user_ratings_total,reviews,formatted_address',
            };
            const response = await axios.get(PLACE_DETAILS_ENDPOINT, { params });
            return response.data.result;
        } catch (error) {
            console.error('Error fetching place details:', error);
            throw error;
        }
    }

    const determineVibesFromReviews = (reviews) => {
        // Define your predefined keywords
        const keywords = ['relaxing',
                          'exciting',
                          'scenic',
                          'historic',
                          'adventurous',
                          'romantic',
                          'family-friendly'];

        // Split reviews into words and convert to lowercase
        const words = reviews.toLowerCase().split(/\s+/);

        // Find matching keywords in the words array
        const matchedKeywords = keywords.filter(keyword => words.includes(keyword));

        return matchedKeywords;
    };

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

const createFetchedExperiences = async (filteredPlaces) => {
    try {
        const createdExperiences = [];
        for (const place of filteredPlaces) {
            const vibeIds = await getVibeIds(place.vibes);
            const experience = new Experience({ name: place.name, location: place.location, vibes: vibeIds });
            await experience.save();
            createdExperiences.push(experience);
        }
        return createdExperiences;
    } catch (error) {
        console.error('Error creating experiences:', error);
        throw error;
    }
};

const getVibeIds = async (keywords) => {
    try {
        const vibeIds = [];
        for (const keyword of keywords) {
            let vibe = await Vibe.findOne({ name: keyword });
            if (!vibe) {
                vibe = new Vibe({ name: keyword });
                await vibe.save();
            }
            vibeIds.push(vibe._id);
        }
        return vibeIds;
    } catch (error) {
        console.error('Error fetching or creating vibes:', error);
        throw error;
    }
};

module.exports = { fetchAndCreateExperiences, createFetchedExperiences };
