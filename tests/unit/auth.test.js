const { assert } = require('chai');
const auth = require('../../lib/auth')();

describe('super sekrit middleware', () => {

    it('calls next with error when no header present', () => {
        const req = { get() {} };

        let error = null;
        const next = err => {
            error = err;
        };
        
        auth(req, null, next);

        assert.equal(error.code, 401);
        assert.equal(error.message, 'No token found');
    });

    it('calls next with error when token is bad', () => {
        const req = {
            get(header) { return header === 'Authorization' ? 'bad token' : ''; }
        };

        let error = null;
        const next = err => {
            error = err;
        };
        
        auth(req, null, next);

        assert.equal(error.code, 401);
        assert.equal(error.message, 'Invalid token');
    });

    it('calls next when token is good', () => {
        const req = {
            get(header) { return header === 'Authorization' ? 'sekrit' : ''; }
        };

        let error = null;
        let called = false;
        const next = err => {
            called = true;
            error = err;
        };
        
        auth(req, null, next);

        assert.ok(called);
        assert.notOk(error);
    });
});