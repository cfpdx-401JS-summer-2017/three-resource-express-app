const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    position: {
        type: String,
        required: true
    },
    company: {
        type: String,
        required: true
    },
    applied: {
        type: Boolean,
        required: true
    },
    interview: [{
        completed: Boolean,
        date: Date,
        with: String
    }],
    url: {
        type: String,
        required: false
    }
});

module.exports = mongoose.model('Job', schema);
