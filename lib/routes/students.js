
const express = require('express');
const router = express.Router();
const Student = require('../models/student');
const jsonParser = require('body-parser').json();

router

    .get('/count', (req, res, next) => {
        Student.find()
            .count()
            .then(count => res.send({ count }))
            .catch(next);
    })

    .get('/:id', (req, res, next) => {
        Student.findById(req.params.id)
            .lean()
            .then(student => {
                if(!student) res.status(404).send(`Cannot GET ${req.params.id}`);
                else res.send(student);
            })
            .catch(next);
    });

module.exports = router;

    