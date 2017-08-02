const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const errorHandler = require('./error-handler');
const createAuth = require('./auth/ensure-auth');

const app = express();

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(express.static('./public'));
const ensureAuth = createAuth();

const auth = require('./routes/auth');
const trees = require('./routes/trees');
const rocks = require('./routes/rocks');
const walkways = require('./routes/walkways');
const flowers = require('./routes/flowers');

app.use('/api/auth', auth);
app.use('/api/trees', ensureAuth, trees);
app.use('/api/rocks', ensureAuth, rocks);
app.use('/api/walkways', ensureAuth, walkways);
app.use('/api/flowers', ensureAuth, flowers);

app.use(errorHandler());

module.exports = app;