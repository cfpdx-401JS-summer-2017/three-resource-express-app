const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const errorHandler = require('./error-handler')();
const createAuth = require('./auth/ensure-auth');

const app = express();

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(express.static('./public'));
const ensureAuth = createAuth();

const auth = require('./routes/auth');
const albums = require('./routes/albums');
// const bands = require('./routes/bands');
// const labels = require('./routes/labels');
const me = require('./routes/me');

app.use('/auth', auth);
app.use('/me', ensureAuth, me);
app.use('/albums', ensureAuth, albums);
// app.use('/bands', ensureAuth, bands);
// app.use('/labels', ensureAuth, labels);

app.use(errorHandler());

module.exports = app;