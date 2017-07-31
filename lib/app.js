const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const errorHandler = require('./error-handler')();



const projects = require('./routes/projects');
// const machines = require('./routes/machines');
// const employees = require('./routes/employees');
// app.use(bodyParser);

app.use('/projects', projects);
// app.use('/machines', machines);
// app.use('/employees', employees);

app.use(errorHandler);

module.exports = app;