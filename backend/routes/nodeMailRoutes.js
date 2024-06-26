const express = require('express');
const router = express.Router();
const sendSignupEmail = require('../controllers/nodemailerController');

router.post('/send-email', sendSignupEmail);

module.exports = router;
