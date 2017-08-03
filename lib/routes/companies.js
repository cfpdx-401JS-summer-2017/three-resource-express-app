const express = require('express');
const router = express.Router();
const Company = require('../models/company');

router
    .get('/', (req, res, next) => {
        Company.find()
            .then(companies => res.send(companies))
            .catch(next);
    })
    
    .get('/:id', (req, res, next) => {
        Company.findById(req.params.id)
            .lean()
            .then(company => {
                if(!company) res.status(404).send(`Cannont GET company with ID:${req.params.id}`);
                else res.send(company);
            })
            .catch(next);
    })
    
    .post('/', (req, res, next) => {
        const company = new Company(req.body);
        company.save()
            .then(company => res.send(company))
            .catch(next);
    })

    .put('/:id', (req, res, next) => {
        Company.findByIdAndUpdate(req.params.id, req.body, { new: true })
            .lean()
            .then(company => res.send(company))
            .catch(next);
    })
    
    .delete('/:id', (req, res) => {
        Company.findByIdAndRemove(req.params.id)
            .then(response => res.send({ removed: !!response }));
    });

module.exports = router;
