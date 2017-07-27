const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    variety: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true,
        enum: ['deciduous', 'coniferous']
    },
    locations: [String],
    bark: [{
        texture: {
            type: String,
            enum: ['smooth', 'rough', 'papery', 'ringed', 'ridged']
        },
        color: String
    }]
});

module.exports = mongoose.model('Tree', schema);