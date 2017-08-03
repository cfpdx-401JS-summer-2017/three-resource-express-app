const express = require('express');
const router = express.Router();
const Job = require('../models/job');

router
    .get('/', (req, res, next) => {
        Job.find()
            .then(jobs => res.send(jobs))
            .catch(next);
    })
    
    .get('/:id', (req, res, next) => {
        Job.findById(req.params.id)
            .lean()
            .then(job => {
                if(!job) res.status(404).send(`Cannot GET job with ID:${req.params.id}`);
                else res.send(job);
            })
            .catch(next);
    })

    .post('/', (req, res, next) => {
        const job = new Job(req.body);
        job
            .save()
            .then(job => res.send(job))
            .catch(next);
    })

    .put('/:id', (req, res, next) => {
        Job.findByIdAndUpdate(req.params.id, req.body, { new: true })
            .lean()
            .then(job => res.send(job))
            .catch(next);
    })

    .delete('/:id', (req, res) => {
        Job.findByIdAndRemove(req.params.id)
            .then(response => res.send({ removed: !!response }));
    });

module.exports = router;
