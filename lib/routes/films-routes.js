const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser').json();
const Film = require('../models/film-model');

router
  .post('/', bodyParser, (req, res, next) => {
    const film = new Film(req.body);
    film
      .save()
      .then(film => {
        res.send(film);
      })
      .catch(next);
  })
  .get('/', bodyParser, (req, res, next) => {
    Film.find()
      .then(films => res.send(films))
      .catch(next);
  })
  .get('/:id', bodyParser, (req, res, next) => {
    Film.findById(req.params.id)
      .then(results => {
        res.send(results)
      })
      .catch(next);
  })
  .delete('/:id', bodyParser, (req, res, next) => {
    Film.findOneAndRemove(req.params.id)
      .then(status => res.send(status))
      .catch(next);
  })
  .patch('/:id', bodyParser, (req, res, next) => {
    Film.findByIdAndUpdate(
      req.body.id,
      { title: req.body.newTitle },
      { new: true, runValidators: true }
    )
      .then(doc => res.send(doc))
      .catch(next);
  })
  .use(bodyParser);

module.exports = router;
