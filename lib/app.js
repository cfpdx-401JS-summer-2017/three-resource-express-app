const express = require('express');
const app = express();
const errorHandler = require('./error-handler');

const tacos = require('./routes/tacos');
const restaurants = require('./routes/restaurants');
const drinks = require('./routes/drinks');

app.use('/tacos', tacos);
app.use('/restaurants', restaurants);
app.use('/drinks', drinks);

app.use(errorHandler);

module.exports = app;