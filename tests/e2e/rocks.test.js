const db = require('./helpers/db');
const request = require('./helpers/request');
const assert = require('chai').assert;

describe('REST API for rocks', () => {

    before(db.drop);

    const skip = {
        type: 'Skipping'
    };

    const basalt = {
        type: 'Basalt'
    };

    const obsidian = {
        type: 'Obsidian'
    };

    function saveRock(rock) {
        return request.post('/api/rocks')
            .send(rock)
            .then(({ body }) => {
                rock._id = body._id;
                rock.__v = body.__v;
                rock.colors = body.colors;
                rock.locations = body.locations;
                return rock;
            });
    }

    it('saves a rock', () => {
        return saveRock(skip)
            .then(savedRock => {
                assert.ok(savedRock._id);
                assert.deepEqual(savedRock, skip);
            });
    });

    it('GETs count of rocks', () => {
        return request.get('/api/rocks/count')
            .then(res => res.body)
            .then(count => assert.ok(count));
    });

    it('GETs a rock if it exists', () => {
        return request.get(`/api/rocks/${skip._id}`)
            .then(res => res.body)
            .then(rock => assert.deepEqual(rock, skip));
    });

    it('returns 404 if rock does not exist', () => {
        return request.get('/api/rocks/123412345567898765466676')
            .then(() => { throw new Error('received 200 code when should be 404'); },
                ({ response }) => {
                    assert.ok(response.notFound);
                    assert.ok(response.error);
                }
            );
    });

    it('GETs all rocks', () => {
        return Promise.all([
            saveRock(obsidian),
            saveRock(basalt)
        ])
            .then(res => {
                const rocks = res.sort((a,b) => {
                    if (a.type > b.type) return 1;
                    else if (a.type < b.type) return -1;
                    else return 0;
                });
                assert.deepEqual(rocks, [basalt, obsidian]);
            });
    });

    it('removes a rock by id', () => {
        return request.delete(`/api/rocks/${obsidian._id}`)
            .then(res => assert.deepEqual(res.body, { removed: true }));
    });

    it('returns removed: false if rock not there to remove', () => {
        return request.delete(`/api/rocks/${obsidian._id}`)
            .then(res => assert.deepEqual(res.body, { removed: false }));
    });

    it('updates a rock by id', () => {
        return request.put(`/api/rocks/${basalt._id}`)
            .send({ colors: ['red', 'brown'] })
            .then(() => request.get(`/api/rocks/${basalt._id}`))
            .then(res => assert.equal(res.body.colors.length, 2));
    });

    it('patches a tree by id', () => {
        return request.patch(`/api/rocks/${basalt._id}`)
            .send({ size: 'very large' })
            .then(res => assert.equal(res.body.size, 'very large'));
    });

});
