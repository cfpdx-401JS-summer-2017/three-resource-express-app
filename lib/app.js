const express = require('express');
const app = express();
const bodyParser = require('body-parser');

const Tree = require('./models/tree');
const Rock = require('./models/rock');
const Walkway = require('./models/walkway');

app.use(bodyParser.json());

app.use(express.static('public'));

app.use('/trees', trees);
app.use('/rocks', rocks);
app.use('/walkways', walkways);


app.use((err, req, res, next) => {

});

module.exports = app;