const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const requiredString = {
    type: String,
    required: true
};

const requiredNum = {
    type: Number,
    required: true
};

const schema = new Schema({
    name: requiredString,
    role: {
        roleName: {
            type: String,
            required: true,
            enum: [ 'operator', 'laborer', 'foreman', 'driver' ]
        },
        rate: requiredNum,
        hours: requiredNum,
    },
    hireDate: Date
});

module.exports = mongoose.model('Employee', schema);