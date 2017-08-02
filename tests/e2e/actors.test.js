const db = require('./helpers/db');
const request = require('./helpers/request');
const assert = require('chai').assert;

describe('actors REST api',()=>{
    
    before(db.drop);

    let token = null;
    before(() => db.getToken().then(t => token = t));

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
        return request
            .post('/actors')
            .set('Authorization', token)
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
            .set('Authorization', token)
            .then(res => res.body)
            .then(actor => {
                assert.equal(actor.name, peterD.name);
                assert.equal(actor.age, peterD.age);
            });
    });

    it('returns 404 if actor does not exist', () => {
        return request.get('/actors/58ff9f496aafd447254c29b5')
            .set('Authorization', token)
            .then(
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
            .then(() => request.get('/actors')
                .set('Authorization', token)
            )
            .then(res => {
                const actors = res.body;
                assert.deepEqual(actors, [peterD, audreyH, harrsF]);
            });
    });
    it('rewrites actor data by id', ()=>{
        return request.put(`/actors/${harrsF._id}`)
            .set('Authorization', token)
            .send(harrison)
            .then(res => {
                assert.isOk(res.body._id);
                assert.equal(res.body.name,harrison.name);
                assert.equal(res.body.age,harrison.age);
            });
    });
    it('deletes actor by id', () =>{
        return request.delete(`/actors/${audreyH._id}`)
            .set('Authorization', token)
            .then(res => {
                assert.deepEqual(JSON.parse(res.text), { removed: true });
            });
    });
    it('fails to delete actor by id', () =>{
        return request.delete(`/actors/${audreyH._id}`)
            .set('Authorization', token)
            .then(res => {
                assert.deepEqual(JSON.parse(res.text), { removed: false });
            });
    });
            
});