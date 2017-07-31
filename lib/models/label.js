const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    name: {
        type: String,
        required: true
    },
    location: {
        country: String,
        city: String
    },
    size: {
        type: String,
        required: true,
        enum: ['major', 'indie', 'diy']
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Label', schema);