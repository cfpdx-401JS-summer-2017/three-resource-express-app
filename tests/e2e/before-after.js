/* let's connect to mongo once here */
const connect = require('../../lib/connect');

let connection = null;

before(() => {
    return connect('mongodb://localhost:27017/hollywood')
        .then(cn => connection = cn);
});

after(() => connection.close());