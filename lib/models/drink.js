const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const requiredString = {
    type: String,
    required: true
};
const schema = new Schema({
    name: requiredString,
    type: {
        type: String,
        required: true,
        enum: ['beer', 'wine', 'margarita', 'soda', 'water']
    },
    size: {
        type: Number,
        enum: [12, 16, 32]
    }
});

module.exports = mongoose.model('Drink', schema);