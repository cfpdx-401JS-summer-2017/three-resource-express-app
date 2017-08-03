const http = require('http');
require('./lib/connect');

const app = require('./lib/app');

const server = http.createServer(app);

const port = 3000;

server.listen(port, () => {
    console.log('server is up and running on port', server.address().port); //eslint-disable-line
});