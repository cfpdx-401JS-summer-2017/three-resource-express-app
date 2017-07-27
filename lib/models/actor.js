const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const actSche = new Schema({
    name:{
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    living: {
        type: Boolean
    }
}, {
    timestamps: true
});
module.exports = mongoose.model('Actor',actSche);