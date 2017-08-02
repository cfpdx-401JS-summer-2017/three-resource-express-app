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
const jobs = require('./routes/jobs');
const companies = require('./routes/companies');
const contacts = require('./routes/contacts');

app.use('/api/auth', auth);
app.use('/api/jobs', ensureAuth, jobs);
app.use('/api/companies', ensureAuth, companies);
app.use('/api/contacts', ensureAuth, contacts);

app.use(errorHandler());

module.exports = app;
