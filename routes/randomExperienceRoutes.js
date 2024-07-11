const express = require('express');
const router = express.Router();
const { randomExperience } = require('../controllers/randomExperienceController');

// GET random experience
router.get('/', randomExperience);

module.exports = router;
