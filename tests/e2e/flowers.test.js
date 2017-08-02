const db = require('./helpers/db');
const request = require('./helpers/request');
const assert = require('chai').assert;

describe('flowers api', () => {

    before(db.drop);

    let token = null;
    before(() => db.getToken().then(t => token = t));

    it('initial GET returns empty list', () => {
        return request.get('/api/flowers')
            .set('Authorization', token)
            .then(req => {
                const flowers = req.body;
                assert.deepEqual(flowers, []);
            });
    });
});