const db = require('./helpers/db');
const request = require('./helpers/request');
const assert = require('chai').assert;

describe('auth', () => {

    before(db.drop);

    const user = {
        email: 'user@email.com',
        password: 'abc'
    };

    describe('user management', () => {
        
        const badRequest = (url, data, code, error) => {
            request
                .post(url)
                .send(data)
                .then(
                    () => {
                        throw new Error('status should not be ok');
                    },
                    res => {
                        assert.equal(res.status, code);
                        assert.equal(res.response.body.error, error);
                    }
                );
        };
        

        it('signup requires email', () => {
            badRequest('/api/auth/signup', { password: 'hello123' }, 400, 'email and password must be supplied');
        });

        it('signup requires password', () => {
            badRequest('/api/auth/signup', { email: 'me@email.com' }, 400, 'email and password must be supplied');
        });

        let token = '';

        it('signup', () => {
            request
                .post('/api/auth/signup')
                .send(user)
                .then(res => assert.ok(token = res.body.token));
        });

        it('can\t use same email', () => {
            badRequest('/api/auth/signup', user, 400, 'email in use');
        });

        it('signin with wrong user', () => {
            badRequest('/api/auth/signup', { user: 'wrong', password: user.password }, 401, 'Invalid Login');
        });

        it('signin with wrong password', () => {
            badRequest('/api/auth/signup', { user: user.email, password: 'wrong' }, 401, 'Invalid Login');
        });

        //TODO:

    });

});
