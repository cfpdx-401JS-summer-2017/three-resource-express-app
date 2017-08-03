const express = require('express');
const router = express.Router();
const Taco = require('../models/taco');
const jsonParser = require('body-parser').json();

router
    .get('/:id', (req, res, next) => {
        Taco.findById(req.params.id)
            .lean()
            .then(taco => {
                if(!taco) res.status(404).send(`cannot GET ${req.params.id}`);
                else res.send(taco);
            })
            .catch(next);

    })

    .get('/', (req, res, next) => {
        Taco.find()
            .lean()
            .select('name type')
            .then(tacos => res.send(tacos))
            .catch(next);
    })
    
    .use(jsonParser)
    .post('/', (req, res, next) => {
        const taco = new Taco(req.body);
        taco
            .save()
            .then(taco => res.send(taco))
            .catch(next);
    })

    .delete('/:id', (req, res, next) => {
        Taco.remove()
            .where({_id: req.params.id})
            .then(response => {
                res.send({removed: response.result.n === 1});})
            .catch(next);
    })

    .put('/:id', (req, res, next) => {
        Taco.findByIdAndUpdate(req.params.id, req.body, {new: true})
            .then(taco => res.send(taco))
            .catch(next);
    });


module.exports = router;