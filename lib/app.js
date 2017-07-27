const express = require('express');
const app = express();
const errorHandler = require('./error-handler')();

app.use(express.static('public'));

const jobs = require('./routes/jobs');
const companies = require('./routes/companies');
const contacts = require('./routes/contacts');

app.use('/jobs', jobs);
app.use('/companies', companies);
app.use('/contacts', contacts);
app.use(errorHandler);

module.exports = app;
