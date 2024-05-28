const jwt = require('jsonwebtoken')
const User = require('../models/userModel')

const requireAuth = async (req, res, next) => {

  // If the user is authenticated, continue with the request
  const { authorization} = req.headers

  if (!authorization) {
    return res.status(401).json({ error: 'You must be logged in.' })
  }

  // Extract the token from the Authorization header
  const token = authorization.split(' ')[1]

  try {
     const { _id } = jwt.verify(token, process.env.SECRET)

     req.user = await User.findOne({ _id }).select('_id')
     next()

  } catch (error) {
    console.log(error)
    res.status(401).json({ error: 'You must be logged in.' })
  }
}

module.exports = requireAuth
