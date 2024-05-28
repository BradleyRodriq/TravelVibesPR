const express = require('express')
const {
    createExperience,
    getExperience,
    getExperiences,
    updateExperience,
    deleteExperience
} = require('../controllers/experienceController')
const requireAuth = require('../middleware/requireAuth')


const router = express.Router()

// require auth for all experience routes
router.use(requireAuth)

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
