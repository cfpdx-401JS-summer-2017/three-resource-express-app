const assert = require('chai').assert;
const User = require('../../lib/models/user');

describe('User model', () => {

    it('new user generates hash', () => {
        const user = new User({
            email: 'christy@washere.com'
        });
        const password = 'hello123';

        user.generateHash(password);

        assert.notEqual(user.hash, password);
        assert.isOk(user.comparePassword('hello123'));
        assert.isNotOk(user.comparePassword('bad password'));
    });

});
