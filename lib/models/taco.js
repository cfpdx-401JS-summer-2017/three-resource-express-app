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
        enum:['chicken', 'pork', 'beef', 'seafood','veggie']
    },
    cheese: Boolean,
    toppings: {
        type: String,
        enum:['lettuce', 'tomato', 'onion', 'cilantro']
    }
});

module.exports = mongoose.model('Taco', schema);