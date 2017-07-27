const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    colors: [String],
    size: String,
    type: {
        type: String,
        required: true
    },
    locations: [String],
    grouped: Boolean
});

module.exports = mongoose.model('Rock', schema);