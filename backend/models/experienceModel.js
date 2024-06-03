const mongoose = require('mongoose')
const Vibe = require('./vibeModel')

const Schema = mongoose.Schema

// experience objects
const experienceSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    vibes: [{
        type: Schema.Types.ObjectId,
        ref: 'Vibe',
        required: true
    }],
    user_id: {
        type: String,
        required: true
    }
}, { timestamps: true })

const Experience = mongoose.model('Experience', experienceSchema)

// export experienceSchema
module.exports = Experience
