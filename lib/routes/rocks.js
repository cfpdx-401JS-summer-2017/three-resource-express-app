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
    })

    .get('/:id', (req, res, next) => {
        Rock.findById(req.params.id)
            .lean()
            .then(rock => {
                if(!rock) res.status(404).send(`Cannot GET ${req.params.id}`);
                else res.send(rock);
            })
            .catch(next);
    })

    .get('/', (req, res, next) => {
        Rock.find()
            .lean()
            .select('type colors locations _if __v')
            .then(rocks => res.send(rocks))
            .catch(next);
    })

    .delete('/:id', jsonParser, (req, res, next) => {
        Rock.findByIdAndRemove(req.params.id)
            .then(result => res.send({ removed: !!result }))
            .catch(next);
    })

    .put('/:id', jsonParser, (req, res, next) => {
        Rock.findByIdAndUpdate(req.params.id, req.body, { new: true })
            .then(rock => res.send(rock))
            .catch(next);
    })

    .patch('/:id', jsonParser, (req, res, next) => {
        Rock.findByIdAndUpdate(req.params.id,
            { $set: req.body },
            {
                new: true,
                runValidators: true
            })
            .then(rock => res.send(rock))
            .catch(next);
    });

module.exports = router;