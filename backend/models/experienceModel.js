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
        default: 'https://media.licdn.com/dms/image/C5112AQG8vVeQlMzOdA/article-cover_image-shrink_720_1280/0/1520219769033?e=1724889600&v=beta&t=S0t9P2hvmkB4AfyKya4QXlexERvJMIdtpuuYIkIu2bo'
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
