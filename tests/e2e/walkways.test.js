const db = require('./helpers/db');
const request = require('./helpers/request');
const assert = require('chai').assert;

describe('REST API for walkways', () => {

    before(db.drop);

    const hilly = {
        type: 'hilly'
    };

    const steep = {  // eslint-disable-line
        type: 'steep'
    };

    const easy = {  // eslint-disable-line
        type: 'easy'
    };

    function saveWalkway(walkway) {
        return request.post('/api/walkways')
            .send(walkway)
            .then(({ body }) => {
                walkway._id = body._id;
                walkway.__v = body.__v;
                walkway.type = body.type;
                return walkway;
            });
    }

    it('saves a walkway', () => {
        return saveWalkway(hilly)
            .then(savedWalkway => {
                assert.ok(savedWalkway._id);
                assert.deepEqual(savedWalkway, hilly);
            });
    });

    it('GETs count of walkways', () => {
        return request.get('/api/walkways/count')
            .then( res => res.body)
            .then(count => assert.ok(count));
    });

    it('GETs a walkway if it exists', () => {
        return request.get(`/api/walkways/${hilly._id}`)
            .then(res => res.body)
            .then(walkway => assert.deepEqual(walkway, hilly));
    });

    it('returns 404 if walkway does not exist', () => {
        return request.get('/api/walkways/123412345567898765466676')
            .then(() => { throw new Error('received 200 code when should be 404'); },
                ({ response }) => {
                    assert.ok(response.notFound);
                    assert.ok(response.error);
                }
            );
    });

    it('GETs all walkways', () => {
        return Promise.all([
            saveWalkway(steep),
            saveWalkway(easy)
        ])
            .then(res => {
                const walkways = res.sort((a,b) => {
                    if(a.type > b.type) return 1;
                    else if (a.type < b.type) return -1;
                    else return 0;
                });
                assert.deepEqual(walkways, [easy, steep]);
            });
    });

    it('removes a walkway by id', () => {
        return request.delete(`/api/walkways/${easy._id}`)
            .then(res => assert.deepEqual(res.body, { removed: true }));
    });

    it('returns removed: false if walkway not there to remove', () => {
        return request.delete(`/api/walkways/${easy._id}`)
            .then(res => assert.deepEqual(res.body, { removed: false }));
    });

    it('updates a walkway by id', () => {
        return request.put(`/api/walkways/${steep._id}`)
            .send({ length: 100 })
            .then(() => request.get(`/api/walkways/${steep._id}`))
            .then(res => assert.equal(res.body['length'], 100));
    });

    it('patches a walkway by id', () => {
        return request.patch(`/api/walkways/${steep._id}`)
            .send({ composition: 'dirt' })
            .then(res => assert.equal(res.body.composition, 'dirt'));
    });
});