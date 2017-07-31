const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const requiredString = {
    type: String,
    required: true
};

const requiredNum = {
    type: Number,
    required: true
};

const schema = new Schema({
    type: requiredString,
    weight: requiredNum,
    width: {
        feet: requiredNum,
        inches: requiredNum
    },
    brand: String
});

module.exports = mongoose.model('Machine', schema);