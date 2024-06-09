const express = require('express');
const router = express.Router();
const { getVibes, createVibe, deleteVibe, getVibebyId } = require('../controllers/vibeController');

// GET all vibes
router.get('/', getVibes);

// GET one vibe by id
router.get('/:vibeId', getVibebyId);

// POST a vibe
router.post('/', createVibe);

// DELETE a vibe
router.delete('/:id', deleteVibe);

module.exports = router;
