const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    name: {
        type: String,
        required: true
    },
    employer: {
        type: String,
        required: true
    },
    connected: {
        type: String,
        required: true,
        enum: ['Mutual Acquaintance', 'Meetup', 'Email']
    }
});

module.exports = mongoose.model('Contacts', schema);
