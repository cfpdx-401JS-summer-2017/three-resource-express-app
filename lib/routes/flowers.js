const Router = require('express').Router;
const router = Router();
const Flower = require('../models/flower');

router
    .post('/', (req, res, next) => {
        new Flower(req.body)
            .save()
            .then(flower => res.send(flower))
            .catch(next);
    })

    .get('/', (req, res, next) => {
        Flower.find()
            .lean()
            .then(flowers => res.send(flowers))
            .catch(next);
    });

module.exports = router;