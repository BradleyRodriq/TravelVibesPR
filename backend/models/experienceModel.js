const mongoose = require('mongoose');
const Schema = mongoose.Schema;

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
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Vibe'
    }]
}, { timestamps: true });

module.exports = mongoose.model('Experience', experienceSchema);
