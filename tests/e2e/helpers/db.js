const connection = require('mongoose').connection;
const request = require('./request');

module.exports = {
    drop() {
        return connection.dropDatabase();
    },
    getToken(user = { email: 'meryl@meryl.com', password: '123' }) {
        return request.post('/auth/signup')
            .send(user)
            .then(res => res.body.token);
    }
};