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
        required: false,
        default: 'Unknown'
    },
    vibes: {
        type: [String],
        required: false,
        default: []
    },
    geolocation: {
        type: {
            type: String,
            enum: ['Point'],
            default: 'Point',
        },
        coordinates: {
            type: [Number],
            required: false,
            default: [0.0, 0.0]
        }
    },
    pictureUrl: {
        type: String,
        required: false,
        default: ''
    },
    rating: {
        type: Number,
        required: false,
        default: 0
    },
    reviews: [{
        text: {
            type: String,
            required: false,
            default: ''
        },
        reviewer: {
            type: String,
            required: false,
            default: ''
        },
        rating: {
            type: Number,
            required: false,
            default: 0
        }
    }]
}, { timestamps: true });

// Index for geolocation
experienceSchema.index({ geolocation: '2dsphere' });

// export experienceSchema
module.exports = mongoose.model('Experience', experienceSchema);
