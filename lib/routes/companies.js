const express = require('express');
const router = express.Router();
const jsonParser = require('body-parser').json();
const Company = require('../models/company');

router
    .get('/', jsonParser, (req, res, next) => {
        Company.find()
            .then(companies => res.send(companies))
            .catch(next);
    })
    
    .get('/:id', jsonParser, (req, res, next) => {
        Company.findById(req.params.id)
            .lean()
            .then(company => {
                if(!company) res.status(404).send(`Cannont GET company with ID:${req.params.id}`);
                else res.send(company);
            })
            .catch(next);
    })
    
    .post('/', jsonParser, (req, res, next) => {
        const company = new Company(req.body);
        company.save()
            .then(company => res.send(company))
            .catch(next);
    })
    
    .delete('/:id', jsonParser, (req, res, next) => {
        Company.findByIdAndRemove(req.params.id)
            .then(response => res.send({ removed: !!response }))
            .catch(next);
    })

    .put('/:id', jsonParser, (req, res, next) => {
        Company.findByIdAndUpdate(req.params.id, req.body, { new: true })
            .lean()
            .then(company => res.send(company))
            .catch(next);
    })
    
    .use(jsonParser);

module.exports = router;
