const Router = require('express').Router;
const router = Router();
const Salsa = require('../models/salsa');
const jsonParser = require('body-parser').json();

router
    .use(jsonParser)
    .post('/', (req, res, next) => { 
        const salsa = new Salsa(req.body);
        salsa
            .save()
            .then(salsa => res.send(salsa))
            .catch(next);
    })
    .get('/:id', (req, res, next) => {
        Salsa.findById(req.params.id)
            .lean()
            .then(salsa => {
                if(!salsa) res.status(404).send(`cannot GET ${req.params.id}`);
                else res.send(salsa);
            })
            .catch(next);
    })
    .get('/', (req, res, next) => {
        Salsa.find()
            .lean()
            .then(salsas => res.send(salsas))
            .catch(next);
    });

module.exports = router;