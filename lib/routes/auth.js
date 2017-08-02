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
    .get('/verify', ensureAuth, (req, res) => {
        res.send({ valid: true });
    });

    //TODO: posts

module.exports = router;
