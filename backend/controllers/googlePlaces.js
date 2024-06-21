const Experience = require('../models/experienceModel');
const Vibe = require('../models/vibeModel');
const axios = require('axios');

const fetchAndCreateExperiences = async (req, res) => {
    const apiKey = process.env.GOOGLE_PLACES_API_KEY;
    const location = '18.2208,-66.5901'; // Latitude and longitude for PR
    const radius = 1000000; // 1000 km
    const types = ['tourist_attraction']; // Only tourist attractions

    const API_ENDPOINT = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json';
    const PLACE_DETAILS_ENDPOINT = 'https://maps.googleapis.com/maps/api/place/details/json';

    const filteredPlaces = [];

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

            const validPlaces = places.filter(place => place.rating >= 3);

            for (const place of validPlaces) {
                const details = await fetchPlaceDetails(place.place_id);
                if (details.reviews && details.reviews.length > 0) {
                    const combinedReviews = details.reviews.map(review => review.text).join(' ');
                    const vibes = determineVibesFromReviews(combinedReviews);

                    if (vibes.length > 0 && details.photos && details.photos.length > 0) {
                        const photoReference = details.photos[0].photo_reference;
                        const pictureUrl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photoReference}&key=${apiKey}`;

                        filteredPlaces.push({
                            name: place.name,
                            location: place.vicinity || details.formatted_address,
                            geolocation: place.geometry.location,
                            vibes: vibes,
                            rating: details.rating,
                            reviews: details.reviews.map(review => ({
                                type: review.relative_time_description,
                                reviewer: review.author_name,
                                rating: review.rating,
                                text: review.text
                            }))
                        });
                    }
                }
            }

            if (response.data.next_page_token) {
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
                fields: 'name,rating,user_ratings_total,reviews,formatted_address,photos',
            };
            const response = await axios.get(PLACE_DETAILS_ENDPOINT, { params });
            const placeDetails = response.data.result;

            let photoReference = null;
            if (placeDetails.photos && placeDetails.photos.length > 0) {
                photoReference = placeDetails.photos[0].photo_reference;
            }

            return { ...placeDetails, photoReference };
        } catch (error) {
            console.error('Error fetching place details:', error);
            throw error;
        }
    };

    const determineVibesFromReviews = (reviews) => {
        const keywordMappings = {
            'relaxing': ['relax', 'calm', 'peaceful', 'tranquil', 'soothing', 'serene', 'mellow', 'restful'],
            'scenic': ['beautiful', 'picturesque', 'scenic', 'breathtaking', 'stunning', 'gorgeous', 'panoramic', 'majestic'],
            'historic': ['ancient', 'traditional', 'historic', 'nostalgic', 'time-honored', 'vintage', 'classic', 'antique'],
            'adventurous': ['daring', 'exploratory', 'adventurous', 'bold', 'courageous', 'intrepid', 'dashing', 'enterprising'],
            'romantic': ['love', 'passionate', 'romantic', 'intimate', 'amorous', 'tender', 'affectionate', 'heartfelt'],
            'family-friendly': ['kids', 'children', 'family-friendly', 'child-friendly', 'kid-friendly', 'youthful', 'juvenile', 'wholesome'],
            'nature': ['nature', 'natural', 'outdoors', 'environment', 'wilderness', 'scenery', 'landscape', 'flora'],
            'hiking': ['hiking', 'trekking', 'walking', 'rambling', 'tramping', 'hike', 'trek', 'walk'],
            'eco-tourism': ['eco-tourism', 'ecological', 'green', 'sustainable', 'environmentally-friendly', 'conservation', 'ecology', 'natural']
        };

        const keywords = Object.keys(keywordMappings);
        const words = reviews.toLowerCase().split(/\s+/);

        const matchedKeywords = keywords.filter(keyword => {
            return words.includes(keyword) || (Array.isArray(keywordMappings[keyword]) && keywordMappings[keyword].some(subKeyword => words.includes(subKeyword)));
        });

        return [...new Set(matchedKeywords)];
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
            const { name, location, geolocation, photoReference } = place;
            const { lat, lng } = geolocation;
            const pictureUrl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photoReference}&key=${process.env.GOOGLE_PLACES_API_KEY}`;
            const experience = new Experience({
                name,
                location,
                geolocation: { type: 'Point', coordinates: [lng, lat] },
                vibes: vibeIds,
                pictureUrl
            });
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
        const existingVibes = await Vibe.find();

        const vibeIds = [];
        for (const keyword of keywords) {
            let vibe = existingVibes.find(vibe => vibe.name === keyword);
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