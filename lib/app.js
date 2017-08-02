const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const errorHandler = require('./error-handler');
const createAuth = require('./auth/ensure-auth');

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(express.static('./public'));
const ensureAuth = createAuth();

const auth = require('./routes/auth');
const actors = require('./routes/actors');
const movies = require('./routes/movies');
const studios = require('./routes/studios');
const me = require('./routes/me');

app.use('/api/auth', auth);
app.use('/api/me', ensureAuth, me);
app.use('/actors', ensureAuth, actors);
app.use('/movies', movies);
app.use('/studios', studios);

app.use(errorHandler());

module.exports = app;