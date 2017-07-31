const { assert } = require('chai');

const createErrorHandler = require('../../lib/error-handler');

describe.only('error handler', () => {

    const errorHandler = createErrorHandler();

    it('sends unknown error to 500 "Internal Server Error"', () => {
        const err = {
            code: 500,
            message: 'Internal Server Error'
        };
        const req = null;
        let code = null;
        let message = null;
        const res = {
            status(c){ code = c; return this; },
            send(m){ message = m; }
        };
        const next = null;

        errorHandler(err, req, res, next);

        assert.equal(code, 500);
        assert.equal(message, 'Internal Server Error');
    });

    it('uses err object code and message properties when they exist', () => {
        const err = {
            code: 401,
            message: 'invalid token'
        };
        const req = null;
        let code = null;
        let message = null;
        const res = {
            status(c){ code = c; return this; },
            send(m) { message = m; }
        };
        const next = null;

        errorHandler(err, req, res, next);

        assert.equal(code, err.code);
        assert.equal(message, err.message);
    });

    it('Sends 400 and validation errors when err.name is ValidationError', () => {
        const err = {
            name: 'ValidationError',
            errors: {
                err1: 'oneError',
                err2: 'twoError'
            }
        };
        const req = null;
        let code = null;
        let message = null;
        const res = {
            status(c){ code = c; return this; },
            send(m) { message = m; }
        };
        const next = null;

        errorHandler(err, req, res, next);

        assert.equal(code, 400);
        assert.equal(message, 'oneError, twoError');
    });

});