const connection = require('mongoose').connection;
const request = require('./request');

module.exports = {

    drop() {
        return connection.dropDatabase();
    },

    getToken(user = { email: 'christy@washere.com', password: 'hello123' }) {
        return request.post('/api/auth/signup')
            .send(user)
            .then(res => res.body.token);
    }
};
