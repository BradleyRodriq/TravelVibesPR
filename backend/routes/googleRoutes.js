const express = require('express');
const router = express.Router();
const requireAuth = require('../middleware/requireAuth');
const { fetchAndCreateExperiences } = require('../controllers/googlePlaces');

// Middleware to require authentication for the following routes
router.use(requireAuth);

// GET route to fetch places from google places API
router.get('/', fetchAndCreateExperiences);

module.exports = router;
