const express = require('express')
const {
    createExperience,
    getExperience,
    getExperiences,
    updateExperience,
    deleteExperience
} = require('../controllers/experienceController')

const router = express.Router()

// GET all experiences
router.get('/', getExperiences)

//GET single experience
router.get('/:id', getExperience)

//POST an experience
router.post('/', createExperience)

//DELETE an experience
router.delete('/:id', deleteExperience)

//UPDATE an experience
router.patch('/:id', updateExperience)


module.exports = router
