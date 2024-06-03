const mongoose = require('mongoose')
const Vibe = require('./vibeModel')

const Schema = mongoose.Schema

// user objects
const userSchema = new Schema({
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

const User = mongoose.model('User', userSchema)

// export experienceSchema
module.exports = User
