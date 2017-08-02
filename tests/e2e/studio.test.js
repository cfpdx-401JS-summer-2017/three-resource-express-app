const db = require('./helpers/db');
const request = require('./helpers/request');
const assert = require('chai').assert;

describe('studios REST api',()=>{

    before(db.drop);

    let token = null;
    before(() => db.getToken().then(t => token = t));

    const lucasFlm = {
        name: 'Lucas Film',
        address: {
            city: 'San Francisco',
            state: 'CA',
            zip: 99999
        }
    };
    const mucusFilm = {
        name: 'Mucus Film',
        address:{
            city: 'sanfan',
            state: 'Cali',
            zip: 32771

        }
    };

    const slvCup = {
        name: 'Silvercup',
        address: {
            city: 'Queens',
            state: 'NY',
            zip: 11101
        }
    };
    
    const ealStu = {
        name: 'Ealing Studios'
    };
    function saveStudio(studio) {
        return request.post('/studios')
            .set('Authorization', token)
            .send(studio)
            .then(({body}) => {
                studio._id = body._id;
                studio.__v = body.__v;
                return body;
            });

    }
    it('saves a studio', () => {
        return saveStudio(mucusFilm)
            .then(savedStudio => {
                assert.isOk(savedStudio._id);
                assert.equal(savedStudio.name, mucusFilm.name);
                assert.deepEqual(savedStudio.address, mucusFilm.address);
            });
    });

    it('GETs studio if it exists', () => {
        return request
            .get(`/studios/${mucusFilm._id}`)
            .set('Authorization', token)
            .then(res => res.body)
            .then(studio => {
                assert.equal(studio.name, mucusFilm.name);
                assert.deepEqual(studio.address, mucusFilm.address);
            });
    });

    it('returns 404 if studio does not exist', () => {
        return request.get('/studios/58ff9f496aafd447254c29b5')
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

    it('GET all studios', () => {
        return Promise.all([
            saveStudio(slvCup),
            saveStudio(ealStu),
        ])
            .then(() => request.get('/studios')
                .set('Authorization', token))
            .then(res => {
                const studios = res.body;
                assert.deepEqual(studios, [mucusFilm, slvCup, ealStu]);
            });
    });
    it('rewrites studio data by id', ()=>{
        return request.put(`/studios/${mucusFilm._id}`)
            .set('Authorization', token)
            .send(lucasFlm)
            .then(res => {
                assert.isOk(res.body._id);
                assert.equal(res.body.name,lucasFlm.name);
                assert.equal(res.body.age,lucasFlm.age);
            });
    });
    it('deletes studio by id', () =>{
        return request.delete(`/studios/${slvCup._id}`)
            .set('Authorization', token)
            .then(res => {
                assert.deepEqual(JSON.parse(res.text), { removed: true });
            });
    });
    it('fails to delete studio by id', () =>{
        return request.delete(`/studios/${slvCup._id}`)
            .set('Authorization', token)
            .then(res => {
                assert.deepEqual(JSON.parse(res.text), { removed: false });
            });
    });
            
});