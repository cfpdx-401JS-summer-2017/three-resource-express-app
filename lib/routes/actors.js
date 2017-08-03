const express = require('express');
const router = express.Router();
const Actor = require('../models/actor');
const jsonParser = require('body-parser').json();

router
    .get('/count',( req, res, next) => {
        Actor.find()
            .count()
            .then(count => res.send({count}))
            .catch(next);
    })
    .get('/:id', (req, res, next) => {
        Actor.findById(req.params.id)
            .lean()
            .then(actor => {
                if(!actor) res.status(404).send(`Cannot GET ${req.params.id}`);
                else res.send(actor);
            })
            .catch(next);


    })
    .get('/', (req, res, next) => {
        Actor.find()
            .lean()
            .select('name age living __v')
            .then(actors => res.send(actors))
            .catch(next);

    })
    .use(jsonParser)

    .post('/', (req, res, next) => {
        const actor = new Actor(req.body);
        actor
            .save()
            .then(actor => res.send(actor))
            .catch(next);
    })
    .delete('/:id', (req,res,next)=>{
        Actor.findByIdAndRemove(req.params.id)
            .then((actor) => res.send( { removed: actor !== null }))
            .catch(next);
    })
    .put('/:id', (req, res, next) => {
        Actor.findByIdAndUpdate(req.params.id, req.body, { new: true })
            .then(actor => res.send(actor))
            .catch(next);
    })
    .patch('/:id', (req, res, next) => {
        Actor.findByIdAndUpdate(req.params.id, {
            $set: req.body
        }, {
            new: true,
            runValidators: true
        })
            .then(actor => res.send(actor))
            .catch(next);
    });
module.exports = router;