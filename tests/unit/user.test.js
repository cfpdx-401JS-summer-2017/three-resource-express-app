const assert = require('chai').assert;
const User = require('../../lib/models/user');

describe('user model', () => {
    it('new uer generates hash', () => {
        const user = new User({
            email: 'me@me.com'
        });
        const password = 'abc';
        user.generateHash(password);

        assert.notEqual(user.hash, password);

        assert.isOk(user.comparePassword('abc'));
    });
});