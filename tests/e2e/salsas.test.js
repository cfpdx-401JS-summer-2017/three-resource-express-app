const db = require('./helpers/db');
const request = require('./helpers/request');
const { assert } = require('chai');

describe('salsas REST api', () => {
    before(db.drop);

    let token = null;
    before(() => db.getToken().then(t => token = t));

    const salsaVerde = {
        name: 'salsa verde',
        type: 'green',
        howSpicy: 'medium'
    };

    const mangoSalsa = {
        name: 'mango salsa',
        type: 'mango',
        howSpicy: 'mild'
    };

    const hotAndSpicy = {
        name: 'hot and spicy',
        type: 'red',
        howSpicy: 'hot'
    };

    function saveSalsa(salsa) {
        return request.post('/salsas')
            .set('Authorization', token)
            .send(salsa)
            .then(({ body }) => {
                salsa._id = body._id;
                salsa.__v = body.__v;
                return body;
            });
    }

    it('saves a salsa', () => {
        return saveSalsa(salsaVerde)
            .then(savedSalsa => {
                assert.isOk(savedSalsa._id);
                assert.deepEqual(savedSalsa, salsaVerde);
            });
    });

    it('gets a salsa if it exists', () => {
        return request
            .get(`/salsas/${salsaVerde._id}`)
            .set('Authorization', token)
            .then(res => res.body)
            .then(salsa => {
                assert.deepEqual(salsa, salsaVerde);
            });
    });

    it('returns 404 if salsa does not exist', () => {
        return request.get('/salsas/609889997766543344455432')
            .set('Authorization', token)
            .then(() => {
                throw new Error('successful status code not expected');
            },
            ({ response }) => {
                assert.ok(response.notFound);
            });
    });

    it('gets all the salsas', () => {
        return Promise.all([
            saveSalsa(hotAndSpicy),
            saveSalsa(mangoSalsa)
        ])
            .then(() => request
                .get('/salsas')
                .set('Authorization', token)
            )
            .then(res => res.body)
            .then(salsas => assert.deepEqual(salsas, [salsaVerde, hotAndSpicy, mangoSalsa]));
    });
});