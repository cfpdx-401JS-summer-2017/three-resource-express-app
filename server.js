const http = require('http');
const connect = require('./lib/connect');
const app = require('./lib/app');

// const dbUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/job-search';
const dbUri = 'mongodb://localhost:27017/job-search';
connect(dbUri);

// connect(dbUri => {
//     // eslint-disable-next-line
//     console.log('connected to database');
// });

const server = http.createServer(app);

const port = process.env.PORT || 3000;

server.listen(port, () => {
    // eslint-disable-next-line
    console.log('server running on', server.address().port);
});
