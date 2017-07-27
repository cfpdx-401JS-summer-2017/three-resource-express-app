
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const errorHandler = require('./error-handler')();

app.use(express.static('public'));

const students = require('./routes/students');

app.use('/students', students);

app.use(errorHandler);

module.exports = app;