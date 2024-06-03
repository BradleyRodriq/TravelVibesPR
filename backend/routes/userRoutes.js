const express = require('express');
const router = express.Router();
const { loginUser, signupUser, addUserVibes, deleteUserVibes, deleteAllUserVibes } = require('../controllers/userController');
const requireAuth = require('../middleware/requireAuth');

// POST route for user login
router.post('/login', loginUser);

// POST route for user signup
router.post('/signup', signupUser);

// Middleware to require authentication for the following routes
router.use(requireAuth);

// POST route to add vibes to user
router.post('/vibes/add', addUserVibes);

// DELETE route to delete vibes from user
router.delete('/vibes/delete', deleteUserVibes);

// DELETE route to delete all vibes from user
router.delete('/vibes/deleteAll', deleteAllUserVibes);

module.exports = router;
