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
                res.send(project);
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

module.exports = router;