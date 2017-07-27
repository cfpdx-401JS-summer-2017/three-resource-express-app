
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({

    title: {
        type: String,
        required: true
    },
    courseId: {
        type: String,
        required: true
    },
    instructor: [{
        name: String,
        dept: String
    }]
}, {timestamps: true
});

module.exports = mongoose.model('Class', schema);