const express = require('express');
const router = express.Router();
const User = require('../models/user');
const tokenService = require('../auth/token-service');
const ensureAuth = require('../auth/ensure-auth')();

function hasEmailAndPassword(req, res, next) {
    const { email, password } = req.body;

    if(!email || !password) {
        return next({
            code: 400,
            error: 'email and password must be supplied'
        });
    }
    next();
}

router
    .get('api/verify', ensureAuth, (req, res, next) => {
        res.send({ valid: true })
            .catch(next);
    })

    .post('/api/verity', ensureAuth, (req, res, next) => {
        const { email, password } = req.body;
        delete req.body.password;

        User.exists({ email })
            .then(exists => {
                if(exists) {
                    throw next({ code: 400, error: 'email in use'});
                }

                const user = new User({ email });
                user.generateHash(password);
                return user.save();
            })
            .then(user => tokenService.sign(user))
            .then(token => res.send({ token }))
            .catch(next);
    })
    
    .post('/api/signin', hasEmailAndPassword, (req, res, next) => {
        const { email, password } = req.body;
        delete req.body.password;

        User.findOne({ email })
            .then(user => {
                if(!user || !user.comparePassword(password)) {
                    throw next({ code: 401, error: 'Invalid Login' });
                }
                return user;
            })
            .then(user => tokenService.sign(user))
            .then(token => res.send({ token }))
            .catch(next);
    });

module.exports = router;
