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

    .get('/:id', (req, res, next) => {
        Flower.findById(req.params.id)
            .lean()
            .then(flower => {
                if(!flower) res.status(404).send(`Cannot GET ${req.params.id}`);
                else res.send(flower);
            })
            .catch(next);
    })

    .get('/', (req, res, next) => {
        Flower.find()
            .lean()
            .then(flowers => res.send(flowers))
            .catch(next);
    });

module.exports = router;