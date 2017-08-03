const Router = require('express').Router;
const router = Router();
const User = require('../models/user');

router
    .get('/drinks', (req, res, next) => {
        User.findById(req.user.id)
            .select('favorites')
            .lean()
            .populate('drinks')
            .then(user => {
                res.send(user.favorites);
            })
            .catch(next);
    })

    .post('/drinks', (req, res, next) => {
        User.findByIdAndUpdate(req.user.id, {
            $addToSet: { drinks: req.body.drinksId}
        }, { new: true})
            .then(user => res.send(user.favorites))
            .catch(next);
    })

    .delete('/drinks/:id', (req, res, next) => {
    
    });

module.exports = router;