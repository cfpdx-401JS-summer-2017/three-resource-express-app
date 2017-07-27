const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    type: {
        type: String,
        required: true,
        enum: ['hilly', 'curvy', 'meandering', 'steep', 'easy', 'shaded']
    },
    length: Number,
    composition: {
        type: String,
        enum: ['dirt', 'gravel', 'asphalt', 'brick', 'concrete']
    }
});

module.exports = mongoose.model('Walkway', schema);