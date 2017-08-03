const express = require('express');
const app = express();
const errorHandler = require('./error-handler');
const morgan = require('morgan');
const createAuth = require('./auth/ensure-auth');

const ensureAuth = createAuth();

const auth = require('./routes/auth');
const salsas = require('./routes/salsas');
const tacos = require('./routes/tacos');
const restaurants = require('./routes/restaurants');
const drinks = require('./routes/drinks');

app.use(morgan('dev'));
app.use('/auth', auth);
app.use('/salsas', ensureAuth, salsas);
app.use('/tacos', tacos);
app.use('/restaurants', restaurants);
app.use('/drinks', drinks);

app.use(errorHandler());

module.exports = app;