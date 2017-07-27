const express = require('express');
const router = express.Router();
const Album = require('../models/album');
const jsonParser = require('body-parser').json();

router
    .get('/count', (req, res, next) => {
        Album.find()
            .count()
            .then(count => res.send({count}))
            .catch(next);
    })

    .get('/:id', (req, res, next) => {
        Album.findById(req.params.id)
            .lean()
            .then(album => {
                if(!album) res.status(404).send(`Cannot GET ${req.params.id}`);
                else res.send(album);
            })
            .catch(next);
    })

    .get('/', (req, res, next) => {
        Album.find()
            .lean()
            .select('name genre year tracks')
            .then(albums => res.send(albums))
            .catch(next);
    })

    .use(jsonParser)

    .post('/', (req, res, next) => {
        const album = new Album(req.body);
        album
            .save()
            .then(album => res.send(album))
            .catch(next);
    })

    .delete('/:id', (req, res, next) => {
        Album.findByIdAndRemove(req.params.id)
            .then(album => res.send(album))
            .catch(next);
    })

    .put('/:id', (req, res, next) => {
        Album.findByIdAndUpdate(req.params.id, req.body, {new:true})
            .then(album => res.send(album))
            .catch(next);
    })

    .patch('/:id', (req, res, next) => {
        Album.findByIdAndUpdate(req.params.id, {
            $set: req.body
        }, {
            new: true,
            runValidators: true
        })
            .then(album => res.send(album))
            .catch(next);
    });