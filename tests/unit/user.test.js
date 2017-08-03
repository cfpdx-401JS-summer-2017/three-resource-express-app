const User = require('../../lib/models/user');
const { assert } = require('chai');

describe('user model', () => {

    it('generates hash for new user', () => {
        const user = new User({
            email: 'meryl@meryl.com'
        });
        const password = '123';

        user.generateHash(password);
        assert.notEqual(user.hash, password);

        assert.isOk(user.comparePassword('123'));
        assert.isNotOk(user.comparePassword('bad password'));

    });
});