const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const moviSche = new Schema({
    title:{
        type: String,
        required: true
    },
    year: {
        type: Number,
        required: true
    },
    genre: {
        type: String
    },
    cast: [{
        type:String
    }]
}, {
    timestamps: true
});
module.exports = mongoose.model('Movie',moviSche);