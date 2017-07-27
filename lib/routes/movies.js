const express = require('express');
const router = express.Router();
const Movie = require('../models/movie');
const jsonParser = require('body-parser').json();

router
    .get('/count',( req, res, next) => {
        Movie.find()
            .count()
            .then(count => res.send({count}))
            .catch(next);
    })
    .get('/:id', (req, res, next) => {
        Movie.findById(req.params.id)
            .lean()
            .then(movie => {
                if(!movie) res.status(404).send(`Cannot GET ${req.params.id}`);
                else res.send(movie);
            })
            .catch(next);


    })
    .get('/', (req, res, next) => {
        Movie.find()
            .lean()
            .select('title year genre cast __v')
            .then(movies => res.send(movies))
            .catch(next);

    })
    .use(jsonParser)

    .post('/', (req, res, next) => {
        const movie = new Movie(req.body);
        movie
            .save()
            .then(movie => res.send(movie))
            .catch(next);
    })
    .delete('/:id', (req,res,next)=>{
        Movie.findByIdAndRemove(req.params.id)
            .then(movie => res.send(movie))
            .catch(next);
    })
    .put('/:id', (req, res, next) => {
        Movie.findByIdAndUpdate(req.params.id, req.body, { new: true })
            .then(movie => res.send(movie))
            .catch(next);
    })
    .patch('/:id', (req, res, next) => {
        Movie.findByIdAndUpdate(req.params.id, {
            $set: req.body
        }, {
            new: true,
            runValidators: true
        })
            .then(movie => res.send(movie))
            .catch(next);
    });
module.exports = router;