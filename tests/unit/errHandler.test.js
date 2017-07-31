const { assert } = require('chai');

function createErrorHandler() {
    return function errorHandler(err, req, res, next) {
        if (err.name === 'ValidationError') {
            res.status(400).send(
                Object.values(err.errors).join(', ')
            );
        } else {
            res.status(err.code||500).send(err.message||'Internal Server Error');
        }
    };
}

describe('error handler', () => {

    const errorHandler = createErrorHandler();

    it('sends unknown error to 500 "Internal Server Error"', () => {
        const err = {};
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
            message:'invalid token'
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

        assert.equal(code, err.code);
        assert.equal(message, err.message);
    });

    it('Sends 400 and validation errors when err.name is ValidationError', () => {
        const err = {
            name: 'ValidationError',
            errors: {
                foo: 'fooError',
                bar: 'barError'
            }
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

        assert.equal(code, 400);
        assert.equal(message, 'fooError, barError');
    });

});