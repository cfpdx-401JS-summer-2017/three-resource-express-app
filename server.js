const app = require('./lib/app');
const http = require('http');

// this will cause mongoose to make the db connection
const connect = require('./lib/connect');

const dbUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/hollywood';
connect(dbUri);

const server = http.createServer(app);

const port = process.env.PORT || 3000;

server.listen(port, () => {
    // eslint-disable-next-line
    console.log('server up and running on', server.address().port);
});