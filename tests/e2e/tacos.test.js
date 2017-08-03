const chai = require('chai');
const assert = chai.assert;
const chaiHttp = require('chai-http');
chai.use(chaiHttp);

process.env.MONGODB_URI = 'mongodb://localhost:27017/tacos-test';

require('../../lib/connect');

const connection = require('mongoose').connection;

const app = require('../../lib/app');
const request = chai.request(app);

describe('tacos REST api', () => {
    before(() => connection.dropDatabase());

    const nomNom = {
        name: 'nomNom',
        type: 'seafood',
        cheese: true,
        toppings: 'onion'
    };

    const babyTaco = {
        name: 'babyTaco',
        type: 'chicken',
        cheese: false,
        toppings: 'cilantro'
    };

    const angryTaco = {
        name: 'angryTaco',
        type: 'veggie',
        cheese: true,
        toppings: 'tomato'
    };

    function saveTaco(taco) {
        return request.post('/tacos')
            .send(taco)
            .then(({ body }) => {
                taco._id = body._id;
                taco.__v = body.__v;
                return body;
            });
    }
    it('saves a taco', () => {
        return saveTaco(angryTaco)
            .then(savedTaco => {
                assert.isOk(savedTaco._id);
                assert.deepEqual(savedTaco, angryTaco);
            });

    });

    it('GETs a taco if it exists', () => {
        return request
            .get(`/tacos/${angryTaco._id}`)
            .then(res => res.body)
            .then(taco => {
                assert.deepEqual(taco, angryTaco);
            });
    });

    it('returns 404 if taco does not exist', () => {
        return request.get('/tacos/893784759823450987612345')
            .then(() => {
                throw new Error('successful status code note expected');
            }, ({ response }) => {
                assert.ok(response.notFound);
            });
    });

    it('GET all tacos', () => {
        return Promise.all([
            saveTaco(nomNom),
            saveTaco(babyTaco)
        ])
            .then(() => request.get('/tacos'))
            .then(res => {
                const tacos = [res.body[0].name, res.body[1].name, res.body[2].name];
                assert.deepEqual(tacos, [angryTaco.name, nomNom.name, babyTaco.name]);
            });
    });

    it('DELETEs a taco by id', () => {
        return request.delete(`/tacos/${angryTaco._id}`)
            .then(res => {
                const message = JSON.parse(res.text);
                assert.deepEqual(message, {removed: true});
            });
    });

    it('returns 404 when deleting a taco that does not exist', () => {
        return request.delete('/tacos/893784759823450987612345')
            .then(res => {
                const message = JSON.parse(res.text);
                assert.deepEqual(message, {removed: false});
            });
    });
        
    it('updates an existing taco', () => {
        return request.put(`/tacos/${babyTaco._id}`)
            .send({toppings: 'onion'})
            .then( () => {
                return request.get(`/tacos/${babyTaco._id}`);
            })
            .then(res => {
                const updatedTaco = res.body;
                assert.equal(updatedTaco.toppings, 'onion');
            });
    });
});