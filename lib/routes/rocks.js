const express = require('express');
const router = express.Router();
const Rock = require('../models/rock');
const jsonParser = require('body-parser').json();

router
    .get('/count', (req, res, next) => {
        Rock.find()
            .count()
            .then(count => res.send({ count }))
            .catch(next);
    })

    .post('/', jsonParser, (req, res, next) => {
        const rock = new Rock(req.body);
        rock
            .save()
            .then(rock => res.send(rock))
            .catch(next);
    });

module.exports = router;