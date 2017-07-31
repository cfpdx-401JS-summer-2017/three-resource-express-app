const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    name: {
        type: String,
        required: true
    },
    genre: {
        type: String,
        required: true
    },
    members: [{
        name: {
            type: String,
            required: true
        },
        role: {
            type: String,
            required: true
        }
    }]
}, {
    timestamps: true
});

module.exports = mongoose.model('Band', schema);