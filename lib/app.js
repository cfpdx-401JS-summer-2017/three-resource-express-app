const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const errorHandler = require('./error-handler')();

app.use(morgan('dev'));
app.use(express.static('public'));

const actors = require('./models/actors');
const movies = require('./models/movies');
const studios = require('./models/studios');

app.use('/actors', actors);
app.use('/movies', movies);
app.use('/studios', studios);

app.use(errorHandler);

module.exports = app;