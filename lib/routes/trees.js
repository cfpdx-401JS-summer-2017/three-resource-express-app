const express = require('express');
const router = express.Router();
const Tree = require('../models/tree');
const jsonParser = require('body-parser').json();

router
    .get('/count', (req, res, next) => {
        Tree.find()
            .count()
            .then(count => res.send({ count }))
            .catch(next);
    })

    .post('/', jsonParser, (req, res, next) => {
        const tree = new Tree(req.body);
        tree
            .save()
            .then(tree => res.send(tree))
            .catch(next);
    })

    .get('/:id', (req, res, next) => {
        Tree.findById(req.params.id)
            .lean()
            .then(tree => {
                if(!tree) res.status(404).send(`Cannot GET ${req.params.id}`);
                else res.send(tree);
            })
            .catch(next);
    })

    .get('/', (req, res, next) => {
        Tree.find()
            .lean()
            .select('variety type _id bark __v locations')
            .then(trees => res.send(trees))
            .catch(next);
    })

    .delete('/:id', jsonParser, (req, res, next) => {
        Tree.findByIdAndRemove(req.params.id)
            .then( result => res.send({ removed: (!!result) }))
            .catch(next);
    })

    .put('/:id', jsonParser, (req, res, next) => {
        Tree.findByIdAndUpdate(req.params.id, req.body, { new: true })
            .then(tree => res.send(tree))
            .catch(next);
    })

    .patch('/:id', jsonParser, (req, res, next) => {
        Tree.findByIdAndUpdate(req.params.id,
            { $set: req.body },
            { 
                new: true,
                runValidators: true
            })
            .then(tree => res.send(tree))
            .catch(next);
    });







module.exports = router;