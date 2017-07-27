const express = require('express');
const router = express.Router();
const Walkway = require('../models/walkway');
const jsonParser = require('body-parser').json();

router
    .get('/count', (req, res, next) => {
        Walkway.find()
            .count()
            .then(count => res.send({ count }))
            .catch(next);
    })

    .post('/', jsonParser, (req, res, next) => {
        const walkway = new Walkway(req.body);
        walkway
            .save()
            .then(walkway => res.send(walkway))
            .catch(next);
    });

module.exports = router;