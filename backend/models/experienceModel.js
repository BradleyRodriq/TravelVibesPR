const mongoose = require('mongoose')

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
    vibes: {
        type: String,
        required: true
    },
    user_id: {
        type: String,
        required: true
    }
}, { timestamps: true })

// export experienceSchema
module.exports = mongoose.model('Experience', experienceSchema)
