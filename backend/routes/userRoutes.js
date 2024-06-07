const express = require('express');
const router = express.Router();
const { loginUser, signupUser, addUserVibes, deleteUserVibe, deleteAllUserVibes, getUserVibes } = require('../controllers/userController');
const requireAuth = require('../middleware/requireAuth');

// POST route for user login
router.post('/login', loginUser);

// POST route for user signup
router.post('/signup', signupUser);

// Middleware to require authentication for the following routes
router.use(requireAuth);

// PUT route to add vibes to user
router.put('/addVibes', addUserVibes);

// DELETE route to delete vibes from user
router.delete('/deleteVibe/:vibeId', deleteUserVibe);

// DELETE route to delete all vibes from user
router.delete('/resetVibes', deleteAllUserVibes);

// GET route to get all vibes of a user
router.get('/vibes', getUserVibes);

module.exports = router;
