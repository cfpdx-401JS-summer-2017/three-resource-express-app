const express = require('express');
const router = express.Router();
const Band = require('../models/band');
const jsonParser = require('body-parser').json();

router
    .get('/count', (req, res, next) => {
        Band.find()
            .count()
            .then(count => res.send({count}))
            .catch(next);
    })

    .get('/:id', (req, res, next) => {
        Band.findById(req.params.id)
            .lean()
            .then(band => {
                if(!band) res.status(404).send(`Cannot GET ${req.params.id}`);
                else res.send(band);
            })
            .catch(next);
    })

    .get('/', (req, res, next) => {
        Band.find()
            .lean()
            .select('name genre year tracks')
            .then(bands => res.send(bands))
            .catch(next);
    })

    .use(jsonParser)

    .post('/', (req, res, next) => {
        const band = new Band(req.body);
        band
            .save()
            .then(band => res.send(band))
            .catch(next);
    })

    .delete('/:id', (req, res, next) => {
        Band.findByIdAndRemove(req.params.id)
            .then(band => res.send(band))
            .catch(next);
    })

    .put('/:id', (req, res, next) => {
        Band.findByIdAndUpdate(req.params.id, req.body, {new:true})
            .then(band => res.send(band))
            .catch(next);
    })

    .patch('/:id', (req, res, next) => {
        Band.findByIdAndUpdate(req.params.id, {
            $set: req.body
        }, {
            new: true,
            runValidators: true
        })
            .then(band => res.send(band))
            .catch(next);
    });