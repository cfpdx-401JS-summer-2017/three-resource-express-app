const assert = require('chai').assert;
const User = require('../../lib/models/user');

describe('user model', () => {

    it('new user generates hash', () => {
        const user = new User({
            email: 'something@here.com'
        });

        const password = 'abc';
        user.generateHash(password);

        assert.notEqual(user.hash, password);

        assert.ok(user.comparePassword('abc'));
        assert.notOk(user.comparePassword('bad password'));
    });
});