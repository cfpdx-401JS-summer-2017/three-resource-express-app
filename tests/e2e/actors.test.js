const chai = require('chai');
const assert = chai.assert;
const chaiHttp = require('chai-http');
chai.use(chaiHttp);

process.env.MONGODB_URI = 'mongodb://localhost:27017/hollywood-test';

require('../../lib/connect');

const connection = require('mongoose').connection;

const app = require('../../lib/app');

const request = chai.request(app);

describe('actors REST api',()=>{
    before(() => connection.dropDatabase());

    const peterD = {
        name: 'Peter Dinklage',
        age: 48,
        living: true
    };

    const audreyH = {
        name: 'Audrey Hepburn',
        age: 63,
        living: false
    };
    
    const harrsF = {
        name: 'harrysin Ford',
        age: 192,
    };
    const harrison = {
        name: 'Harrison Ford',
        age: 75
    };
    function saveActor(actor) {
        return request.post('/actors')
            .send(actor)
            .then(({body}) => {
                actor._id = body._id;
                actor.__v = body.__v;
                return body;
            });

    }
    it('saves a actor', () => {
        return saveActor(peterD)
            .then(savedActor => {
                assert.isOk(savedActor._id);
                assert.equal(savedActor.name, peterD.name);
                assert.equal(savedActor.age, peterD.age);
            });
    });

    it('GETs actor if it exists', () => {
        return request
            .get(`/actors/${peterD._id}`)
            .then(res => res.body)
            .then(actor => {
                assert.equal(actor.name, peterD.name);
                assert.equal(actor.age, peterD.age);
            });
    });

    it('returns 404 if actor does not exist', () => {
        return request.get('/actors/58ff9f496aafd447254c29b5').then(
            () => {
                //resolve
                throw new Error('successful status code not expected');
            },
            ({ response }) => {
                //reject
                assert.ok(response.notFound);
                assert.isOk(response.error);
            }
        );
    });

    it('GET all actors', () => {
        return Promise.all([
            saveActor(audreyH),
            saveActor(harrsF),
        ])
            .then(() => request.get('/actors'))
            .then(res => {
                const actors = res.body;
                assert.deepEqual(actors, [peterD, audreyH, harrsF]);
            });
    });
    it('rewrites actor data by id', ()=>{
        return request.put(`/actors/${harrsF._id}`)
            .send(harrison)
            .then(res => {
                assert.isOk(res.body._id);
                assert.equal(res.body.name,harrison.name);
                assert.equal(res.body.age,harrison.age);
            });
    });
    it('deletes actor by id', () =>{
        return request.delete(`/actors/${audreyH._id}`)
            .then(res => {
                assert.deepEqual(JSON.parse(res.text), { removed: true });
            });
    });
    it('fails to delete actor by id', () =>{
        return request.delete(`/actors/${audreyH._id}`)
            .then(res => {
                assert.deepEqual(JSON.parse(res.text), { removed: false });
            });
    });
            
});