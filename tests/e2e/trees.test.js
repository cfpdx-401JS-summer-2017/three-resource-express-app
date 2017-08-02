const db = require('./helpers/db');
const request = require('./helpers/request');
const assert = require('chai').assert;

describe('REST API for trees', () => {

    before(db.drop);

    const oak = {
        variety: 'Oak',
        type: 'deciduous'
    };

    const birch = {
        variety: 'Birch',
        type: 'deciduous'
    };

    const redwood = {
        variety: 'Redwood',
        type: 'coniferous'
    };

    function saveTree(tree) {
        return request.post('/api/trees')
            .send(tree)
            .then(({ body }) => {
                tree._id = body._id;
                tree.__v = body.__v;
                tree.bark = body.bark;
                tree.locations = body.locations;
                return tree;
            });
    }

    it('saves a tree', () => {
        return saveTree(oak)
            .then(savedTree => {
                assert.ok(savedTree._id);
                assert.deepEqual(savedTree, oak);
            });
    });

    it('GETs count of trees', () => {
        return request.get('/api/trees/count')
            .then(res => res.body)
            .then(count => assert.ok(count));
    });

    it('GETs a tree if it exists', () => {
        return request.get(`/api/trees/${oak._id}`)
            .then(res => res.body)
            .then(tree => assert.deepEqual(tree, oak));
    });

    it('returns 404 if tree does not exist', () => {
        return request.get('/api/trees/123412345567898765466676')
            .then(() => { throw new Error('received 200 code when should be 404'); },
                ({ response }) => {
                    assert.ok(response.notFound);
                    assert.ok(response.error);
                }
            );
    });

    it('GETs all trees', () => {
        return Promise.all([
            saveTree(birch),
            saveTree(redwood)
        ])
            .then(res => {
                const trees = res.sort((a,b) => {
                    if(a.variety > b.variety) return 1;
                    else if (a.variety < b.variety) return -1;
                    else return 0;
                });
                assert.deepEqual(trees, [birch, redwood]);
            });
    });

    it('removes a tree by id', () => {
        return request.delete(`/api/trees/${birch._id}`)
            .then(res => assert.deepEqual(res.body, { removed: true }));
    });
    
    it('returns removed: false if no tree to remove', () => {
        return request.delete(`/api/trees/${birch._id}`)
            .then(res => assert.deepEqual(res.body, { removed: false }));
    });

    it('updates a tree by id', () => {
        return request.put(`/api/trees/${redwood._id}`)
            .send({ bark: [ { texture: 'rough'}, { color: 'red' }] })
            .then(() => request.get(`/api/trees/${redwood._id}`))
            .then(res => assert.equal(res.body.bark.length, 2));
    });

    it('patches a tree by id', () => {
        return request.patch(`/api/trees/${redwood._id}`)
            .send({ variety: 'cedar' })
            .then(res => assert.equal(res.body.variety, 'cedar'));
    });
});