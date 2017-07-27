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
    })

    .get('/:id', (req, res, next) => {
        Walkway.findById(req.params.id)
            .lean()
            .then(walkway => {
                if(!walkway) res.status(404).send(`Cannot GET ${req.params.id}`);
                else res.send(walkway);
            })
            .catch(next);
    })

    .get('/', (req, res, next) => {
        Walkway.find()
            .lean()
            .select('type length composition __v _id')
            .then(walkways => res.send(walkways))
            .catch(next);
    })

    .delete('/:id', jsonParser, (req, res, next) => {
        Walkway.findByIdAndRemove(req.params.id)
            .then(result => res.send({ removed: (!!result) }))
            .catch(next);
    });

module.exports = router;