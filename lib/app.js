const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const errorHandler = require('./error-handler')();

app.use(morgan('dev'));
app.use(express.static('public'));

const albums = require('./routes/albums');
const bands = require('./routes/bands');
const labels = require('./routes/labels');

app.use('/albums', albums);
app.use('/bands', bands);
app.use('/labels', labels);

app.use(errorHandler);

module.exports = app;