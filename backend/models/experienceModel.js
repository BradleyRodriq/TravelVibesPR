const mongoose = require('mongoose');

const Schema = mongoose.Schema;

// experience objects
const experienceSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: false
    },
    vibes: {
        type: [String],
        required: false
    },
    geolocation: {
        type: {
            type: String,
            enum: ['Point'],
            default: 'Point',
        },
        coordinates: {
            type: [Number],
            required: false
        }
    },
    pictureUrl: {
        type: String,
        required: false
    }
}, { timestamps: true });

// Index for geolocation
experienceSchema.index({ geolocation: '2dsphere' });

// export experienceSchema
module.exports = mongoose.model('Experience', experienceSchema);
