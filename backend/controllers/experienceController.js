const Experience = require('../models/experienceModel')
const mongoose = require('mongoose')

// get all experiences
const getExperiences = async(req, res) => {
    const experiences = await Experience.find({}).sort({ createdAt: -1 })

    res.status(200).json(experiences)
}

// get a single experience
const getExperience = async(req, res) => {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({error: 'No such experience'})

    }

    const experience = await Experience.findById(id)

    if (!experience) {
        return res.status(404).json({error: 'No such experience'})
    }
    res.status(200).json(experience)
}

// create a single experience
const createExperience = async (req, res) => {
    // add doc to db
    const { name, location, vibes } = req.body

    let emptyFields = []

    if(!name) {
        emptyFields.push('name')
    }

    if(!location) {
        emptyFields.push('location')
    }

    if(!vibes) {
        emptyFields.push('vibes')
    }

    if(emptyFields.length > 0) {
        return res.status(400).json({error: 'Please fill in all the fields', emptyFields})
    }

    try {
        const experience = await Experience.create({ name, location, vibes })
        res.status(200).json(experience)
    } catch (error) {
        res.status(400).json({error: error.message})
    }
}
// delete an experience
const deleteExperience = async (req, res) => {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({error: 'No such experience'})
    }

    const experience = await Experience.findOneAndDelete({ _id: id })

    if (!experience) {
        return res.status(404).json({error: 'No such experience'})
    }
    res.status(200).json(experience)
}
// update an experience
const updateExperience = async (req, res) => {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({error: 'No such experience'})
    }
    const experience = await Experience.findOneAndUpdate({ _id: id }, {
        ...req.body
    })

    if (!experience) {
        return res.status(404).json({error: 'No such experience'})
    }
    res.status(200).json(experience)
}
module.exports = {
    createExperience,
    getExperience,
    getExperiences,
    deleteExperience,
    updateExperience
}
