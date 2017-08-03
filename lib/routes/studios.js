const express = require('express');
const router = express.Router();
const Studio = require('../models/studio');
const jsonParser = require('body-parser').json();

router
    .get('/count',( req, res, next) => {
        Studio.find()
            .count()
            .then(count => res.send({count}))
            .catch(next);
    })
    .get('/:id', (req, res, next) => {
        Studio.findById(req.params.id)
            .lean()
            .then(studio => {
                if(!studio) res.status(404).send(`Cannot GET ${req.params.id}`);
                else res.send(studio);
            })
            .catch(next);


    })
    .get('/', (req, res, next) => {
        Studio.find()
            .lean()
            .select('name address __v')
            .then(studios => res.send(studios))
            .catch(next);

    })
    .use(jsonParser)

    .post('/', (req, res, next) => {
        const studio = new Studio(req.body);
        studio
            .save()
            .then(studio => res.send(studio))
            .catch(next);
    })
    .delete('/:id', (req,res,next)=>{
        Studio.findByIdAndRemove(req.params.id)
            .then((studio) => res.send( { removed: studio !== null }))
            .catch(next);
    })
    .put('/:id', (req, res, next) => {
        Studio.findByIdAndUpdate(req.params.id, req.body, { new: true })
            .then(studio => res.send(studio))
            .catch(next);
    })
    .patch('/:id', (req, res, next) => {
        Studio.findByIdAndUpdate(req.params.id, {
            $set: req.body
        }, {
            new: true,
            runValidators: true
        })
            .then(studio => res.send(studio))
            .catch(next);
    });
module.exports = router;