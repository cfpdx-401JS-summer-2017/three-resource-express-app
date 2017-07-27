
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({

    name: {
        type: String,
        required: true
    },
    degrees: {
        type: String,
        enum: ['bachelor', 'master', 'doctorate']
    },

    zip: {
        type: Number,
        required: true
    },
    phone: String
});

module.exports = mongoose.model('School', schema);