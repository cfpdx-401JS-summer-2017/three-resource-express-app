const db = require('./helpers/db');
const request = require('./helpers/request');
const assert = require('chai').assert;

describe.only('auth', () => {

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
                        console.log('error code >>>>', res.status);
                        console.log('error msg >>>>', res.response.body.error);
                        assert.equal(res.status, code);
                        assert.equal(res.response.body.error, error);
                    }
                );
        };
        

        it('signup fails when email is not provided', () => {
            badRequest('/api/auth/signup', { password: 'ilovedogs' }, 400, 'email and password must be supplied');
        });

        it('signup fails when password is not provided', () => {
            badRequest('/api/auth/signup', { email: 'me@email.com' }, 400, 'email and password must be supplied');
        });

        let token = '';

        it('signup successful', () => {
            request
                .post('/api/auth/signup')
                .send(user)
                .then(res => assert.ok(token = res.body.token));
        });

        it('signup fails when email has already been used', () => {
            badRequest('/api/auth/signup', user, 400, 'email in use');
        });

        it('signin fails with wrong user', () => {
            badRequest('/api/auth/signup', { user: 'wrong', password: user.password }, 401, 'Invalid Login');
        });

        it('signin fails with wrong password', () => {
            badRequest('/api/auth/signup', { user: user.email, password: 'wrong' }, 401, 'Invalid Login');
        });
        
        it('signin successful', () => {
            request
                .post('/api/auth/signin')
                .send(user)
                .then(res => assert.ok(res.body.token));
        });

        //TODO:

    });

});
