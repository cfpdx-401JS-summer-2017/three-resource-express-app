const chai = require('chai');
const assert = chai.assert;
const chaiHttp = require('chai-http');
chai.use(chaiHttp);

process.env.MONGODB_URI = 'mongodb://localhost:27017/drinks-test';

require('../../lib/connect');

const connection = require('mongoose').connection;

const app = require('../../lib/app');
const request = chai.request(app);

describe('drinks REST api', () => {
    before(() => connection.dropDatabase());

    const margarita = {
        name: 'margarita',
        type: 'margarita',
        size: 32
    };

    const beer = {
        name: 'IPA',
        type: 'beer',
        size: 16
    };

    const basic = {
        name: 'h2O',
        type: 'water',
        size: 12
    };

    function saveDrink(drink) {
        return request.post('/drinks')
            .send(drink)
            .then(({ body }) => {
                drink._id = body._id;
                drink.__v = body.__v;
                return body;
            });
    }

    it('saves a drink', () => {
        return saveDrink(basic)
            .then(savedDrink => {
                assert.isOk(savedDrink._id);
                assert.deepEqual(savedDrink, basic);
            });
    });

    it('gets a drink if it exists', () => {
        return request
            .get(`/drinks/${basic._id}`)
            .then(res => res.body)
            .then(drink => {
                assert.deepEqual(drink, basic);
            });
    });

    it('returns 404 if drink does not exist', () => {
        return request.get('/drinks/897638473647898765432345')
            .then(() => {
                throw new Error('successful status code not expected');
            },
            ({ response }) => {
                assert.ok(response.notFound);
            });
    });

    it('gets all the drinks', () => {
        return Promise.all([
            saveDrink(beer),
            saveDrink(margarita)
        ])
            .then(() => request.get('/drinks'))
            .then(res => {
                const drinks = [res.body[0].name, res.body[1].name, res.body[2].name];
                assert.deepEqual(drinks, [basic.name, beer.name, margarita.name]);
            });
    });

    it('deletes a drink by id', () => {
        return request.delete(`/drinks/${beer._id}`)
            .then(res => {
                const message = JSON.parse(res.text);
                assert.deepEqual(message, {removed: true});
            });
    });

    it('returns 404 when deleting a drink that does not exist', () => {
        return request.delete('/drinks/897638473647898765432345')
            .then(res => {
                const message = JSON.parse(res.text);
                assert.deepEqual(message, {removed: false});
            });
    });

    it('updates an existing drink', () => {
        return request.put(`/drinks/${margarita._id}`)
            .send({size: 16})
            .then(() => {
                return request.get(`/drinks/${margarita._id}`);
            })
            .then(res => {
                const updatedDrink = res.body;
                assert.equal(updatedDrink.size, 16);
            });
    });
});