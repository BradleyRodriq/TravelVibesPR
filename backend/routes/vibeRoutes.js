const express = require('express');
const router = express.Router();
const { getVibes, createVibe, deleteVibe } = require('../controllers/vibeController');

// GET all vibes
router.get('/', getVibes);

// POST a vibe
router.post('/', createVibe);

// DELETE a vibe
router.delete('/:id', deleteVibe);

module.exports = router;
