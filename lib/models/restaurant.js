const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const requiredString = {
    type: String,
    required: true
};
const schema = new Schema({
    name: requiredString,
    address: {
        street: String,
        city: String,
        state: String,
        zip: Number
    }
});

module.exports = mongoose.model('Restaurant', schema);