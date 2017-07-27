const express = require('express');
const router = express.Router();
const Project = require('../models/project');
const jsonParser = require('body-parser').json();
// const machines = require('./machines');
// const employees = require('./employees');

router

    .get('/:id', (req, res, next) => {
        Project.findById(req.params.id)
            .lean()
            .then( project => {
                if(!project) next();
                else res.send(project);
            })
            .catch(next);
    })

    .get('/', (req, res, next) => {
        Project.find()
            .lean()
            .select('name projectNo')
            .then( projects => res.send(projects))
            .catch(next);
    })

    .delete('/:id', (req, res, next) => {
        Project.remove()
            .where({ _id: req.params.id})
            .then( response => {
                res.send({ removed: response.result.n === 1 });
            })
            .catch(next);
    })
    .use(jsonParser)

    .post('/', (req, res, next) => {
        const project = new Project(req.body);
        project
            .save()
            .then( project => {

                res.send(project);
            })
            .catch(next);
    })

    .put('/:id', (req, res, next) => {
        Project.update({ _id: req.params.id }, { $set: req.body}, { new: true, multi: false, runValidators: true })
            .lean()
            .then( response => {
                // const updated = project.body;
                res.send({ modified: response.nModified === 1 });
            })
            .catch(next);
    });

module.exports = router;