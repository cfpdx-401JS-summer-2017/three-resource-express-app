const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser').json();
const Studio = require('../models/studio-model');
const Film = require('../models/film-model');

router
    .post('/', bodyParser, (req, res, next) => {
        const studio = new Studio(req.body);

        studio.save()
            .then(studio => res.send(studio))
            .catch(next);
    })

    .get('/:id', bodyParser, (req, res, next) => {
        Promise.all([
            Studio.findById(req.params.id).lean(),
            Film.find({ studio: req.params.id })
                .lean()
                .select('title')
        ])
            .then( studioInfo => {
                if(!studioInfo[0]) next();
                else {
                    let studio = studioInfo[0];
                    studio.films = studioInfo[1];
                    return res.send(studio);
                }
            })
            .catch(next);
    })

    .get('/', bodyParser, (req, res, next) => {
        Studio.find()
            .then(studios => res.send(studios))
            .catch(next);
    })

    .put('/:id', bodyParser, (req, res, next) => {
        Studio.update(
            { _id: req.params.id },
            { $set: req.body}, {
                new: true,
                multi: false,
                runValidators: true
            })
            .lean()
            .then( response => {
                res.send({ modified: response.nModified === 1 });
            })
            .catch(next);
    })

    .delete('/:id', bodyParser, (req, res, next) => {
        Studio.verifyRemove(req.params.id)
            .then(store => res.send( { removed: !!store } ))
            .catch(next);
    });

module.exports = router;
