const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const errorHandler = require('./error-handler');

const trees = require('./routes/trees');
const rocks = require('./routes/rocks');
const walkways = require('./routes/walkways');

app.use(bodyParser.json());

app.use(express.static('public'));

app.use('/trees', trees);
app.use('/rocks', rocks);
app.use('/walkways', walkways);

app.use(errorHandler);

module.exports = app;