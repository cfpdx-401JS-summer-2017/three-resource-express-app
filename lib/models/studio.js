const mongoose = require('mongoose');
// I'm require the Schema "class" so we can make a schema instance
const Schema = mongoose.Schema;

const studiSche = new Schema({
    name:{
        type: String,
        required: true
    },
    address:{
        city: String,
        state: String,
        zip: Number
    }
    
}, {
    timestamps: true
});

module.exports = mongoose.model('Studio', studiSche);