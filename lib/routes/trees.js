const express = require('express');
const router = express.Router();
const Tree = require('../models/tree');
const jsonParser = require('body-parser').json();

router
    .get('/count', jsonParser, (req, res, next) => {
        Tree.find()
            .count()
            .then(count => res.send({ count }))
            .catch(next);
    })

    .post('/', jsonParser, (req, res, next) => {
        const tree = new Tree(req.body);
        tree
            .save()
            .then(tree => res.send(tree))
            .catch(next);
    });








module.exports = router;