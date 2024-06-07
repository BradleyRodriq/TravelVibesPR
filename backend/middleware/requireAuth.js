const jwt = require('jsonwebtoken')
const User = require('../models/userModel')

const requireAuth = async (req, res, next) => {
    const { authorization } = req.headers;

    if (!authorization) {
        return res.status(401).json({ error: 'Authorization token required' });
    }

    const token = authorization.split(' ')[1];

    try {
        const { _id } = jwt.verify(token, process.env.SECRET);
        req.user = await User.findById(_id).select('_id'); // Add any other fields you need
        next();
    } catch (error) {
        console.error('Error in requireAuth:', error);
        res.status(401).json({ error: 'Request is not authorized' });
    }
};

module.exports = requireAuth
