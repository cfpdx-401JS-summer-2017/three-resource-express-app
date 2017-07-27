const express = require('express');
const router = express.Router();
const jsonParser = require('body-parser').json();
const Job = require('../models/job');
// const companies = ('../models/companies);
// const contacts = ('../models/contacts);

router
    .get('/', jsonParser, (req, res, next) => {
        Job.find()
            .then(jobs => res.send(jobs))
            .catch(next);
    })
    
    .get('/:id', jsonParser, (req, res, next) => {
        Job.findById(req.params.id)
            .lean()
            .then(job => {
                if(!job) res.status(404).send(`Cannot GET job with ID:${req.params.id}`);
                else res.send(job);
            })
            .catch(next);
    })

    .post('/', jsonParser, (req, res, next) => {
        const job = new Job(req.body);
        job
            .save()
            .then(job => res.send(job))
            .catch(next);
    })

    .delete('/:id', jsonParser, (req, res, next) => {
        Job.findByIdAndRemove(req.params.id)
            .then(job => (job === null) ? res.send({ removed: false }) : res.send({ removed: true }))
            .catch(next);
    })

    .put('/:id', (req, res, next) => {
        // Job.updateOne(req.params.id, req.body, { overwrite: true })
        Job.findByIdAndUpdate(req.params.id, req.body, { new: true })
            .lean()
            .then(job => res.send(job))
            .catch(next);
    })

    .patch(':/id', (req, res, next) => {
        Job.findByIdAndUpdate(req.params.id, {
            $set: req.body
        },{
            new: true,
            runValidators: true
        })
            .then(job => res.send(job))
            .catch(next);
    })

    .use(jsonParser);

module.exports = router;
