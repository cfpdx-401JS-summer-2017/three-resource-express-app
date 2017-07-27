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
    projectNo: requiredNum,
    equipment: {
        needed: [],
        enum: [
            'dozer', 'roller', '400 excavator',
            '300 excavator', '220 excavator',
            'mini excavator']
    },
    employees: {
        needed: [],
        enum: [
            'Bob', 'Dave', 'Doug', 'Stan', 
            'Ian', 'Brian', 'Dennis'
        ]
    },
    endDate: requiredString,
    contractPrice: requiredString
});

module.exports = mongoose.model('Project', schema);