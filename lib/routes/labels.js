const express = require('express');
const router = express.Router();
const Label = require('../models/label');
const jsonParser = require('body-parser').json();

router
    .use(jsonParser)
    .get('/count', (req, res, next) => {
        Label.find()
            .count()
            .then(count => res.send({count}))
            .catch(next);
    })

    .get('/:id', (req, res, next) => {
        Label.findById(req.params.id)
            .lean()
            .then(label => {
                if(!label) res.status(404).send(`Cannot GET ${req.params.id}`);
                else res.send(label);
            })
            .catch(next);
    })

    .get('/', (req, res, next) => {
        Label.find()
            .lean()
            .select('name genre year tracks')
            .then(labels => res.send(labels))
            .catch(next);
    })

    .post('/', (req, res, next) => {
        const label = new Label(req.body);
        label
            .save()
            .then(label => res.send(label))
            .catch(next);
    })

    .delete('/:id', (req, res, next) => {
        Label.findByIdAndRemove(req.params.id)
            .then(label => res.send(label))
            .catch(next);
    })

    .put('/:id', (req, res, next) => {
        Label.findByIdAndUpdate(req.params.id, req.body, {new:true})
            .then(label => res.send(label))
            .catch(next);
    })

    .patch('/:id', (req, res, next) => {
        Label.findByIdAndUpdate(req.params.id, {
            $set: req.body
        }, {
            new: true,
            runValidators: true
        })
            .then(label => res.send(label))
            .catch(next);
    });

module.exports = router;