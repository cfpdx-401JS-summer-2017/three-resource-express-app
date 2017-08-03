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
        enum: ['green', 'red', 'black bean', 'mango']
    },
    howSpicy: {
        type: String,
        required: true,
        enum: ['mild', 'medium', 'hot']
    }
});

module.exports = mongoose.model('Salsa', schema);