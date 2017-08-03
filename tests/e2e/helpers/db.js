const connection = require('mongoose').connection;
const request = require('./request');

module.exports = {
    drop() {
        return connection.dropDatabase();
    },
    getToken(user = { email: 'something@here.com', password:'abc' }) {
        return request.post('/api/auth/signup')
            .send(user)
            .then(res => res.body.token);
    }
};