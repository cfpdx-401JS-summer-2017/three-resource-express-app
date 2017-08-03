const Router = require('express').Router;
const router = Router();
const Restaurant = require('../models/restaurant');
const jsonParser = require('body-parser').json();

router 
    .use(jsonParser)
    .post('/', (req, res, next) => {
        const restaurant = new Restaurant(req.body);
        restaurant
            .save()
            .then(restaurant => res.send(restaurant))
            .catch(next);
    })
    .get('/:id', (req, res, next) => {
        Restaurant.findById(req.params.id)
            .lean()
            .then(restaurant => {
                if(!restaurant) res.status(404).send(`cannot GET ${req.params.id}`);
                else res.send(restaurant);
            })
            .catch(next);
    })
    .get('/', (req, res, next) => {
        Restaurant.find()
            .lean()
            .select('name')
            .then(restaurants => res.send(restaurants))
            .catch(next);
    })
    .delete('/:id', (req, res, next) => {
        Restaurant.remove()
            .where({ _id: req.params.id})
            .then(response => {
                res.send({removed: response.result.n === 1});
            })
            .catch(next);
    })
    .put('/:id', (req, res, next) => {
        Restaurant.findByIdAndUpdate(req.params.id, req.body, { new: true})
            .then(restaurant => res.send(restaurant))
            .catch(next);
    });

module.exports = router;