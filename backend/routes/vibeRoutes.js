const express = require('express')

// user vibe functions
const { changeVibes, 
    addVibes, 
    editVibes, 
    deleteVibes, 
    returnVibesToDefault} = require('../controllers/userController')
const { getVibes, createVibe, getVibe, deleteVibe, updateVibe } = require('../controllers/vibeController')

const router = express.Router()

// GET all vibes
router.get('/', getVibes)

//GET single vibe
router.get('/:id', getVibe)

//POST a vibe
router.post('/', createVibe)

//DELETE a vibe
router.delete('/:id', deleteVibe)

//UPDATE a vibe
router.patch('/:id', updateVibe)


module.exports = router
