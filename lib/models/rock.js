const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    type: {
        type: String,
        required: true
    },
    colors: [String],
    size: String,
    locations: [String],
});

module.exports = mongoose.model('Rock', schema);