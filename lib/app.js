const express = require('express');
const app = express();
const errorHandler = require('./error-handler');
const bodyParser = require('body-parser');

app.use(bodyParser.json());
const auth = require('./routes/auth');
const tacos = require('./routes/tacos');
const restaurants = require('./routes/restaurants');
const drinks = require('./routes/drinks');

app.use('/auth', auth);
app.use('/tacos', tacos);
app.use('/restaurants', restaurants);
app.use('/drinks', drinks);

app.use(errorHandler());

module.exports = app;