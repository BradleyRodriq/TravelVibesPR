const express = require('express');
const router = express.Router();
const { getExperiences, getExperience, createExperience, deleteExperience, updateExperience, addExperienceVibes, deleteExperienceVibes, deleteAllExperienceVibes } = require('../controllers/experienceController');
const requireAuth = require('../middleware/requireAuth');

// GET all experiences
router.get('/', getExperiences);

// GET single experience
router.get('/:id', getExperience);

// Middleware to require authentication for the following routes
router.use(requireAuth);

// POST create an experience
router.post('/', createExperience);

// DELETE delete an experience
router.delete('/:id', deleteExperience);

// PATCH update an experience
router.patch('/:id', updateExperience);

// POST add vibes to an experience
router.post('/:id/vibes', addExperienceVibes);

// DELETE delete vibes from an experience
router.delete('/:id/vibes', deleteExperienceVibes);

// DELETE delete all vibes from an experience
router.delete('/:id/vibes', deleteAllExperienceVibes);

module.exports = router;
