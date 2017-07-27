const chai = require('chai');
const assert = chai.assert;
const chaiHttp = require('chai-http');
chai.use(chaiHttp);

process.env.MONGODB_URL = 'mongodb://localhost:27017/arboretum-test';
require('../../lib/connect');

const connection = require('mongoose').connection;
const app = require('../../lib/app');
const request = chai.request(app);

describe('REST API for walkways', () => {

    before(() => connection.dropDatabase());

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
        return request.post('/walkways')
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
        return request.get('/walkways/count')
            .then(count => count.body)
            .then(count => assert.ok(count));
    });

    it('GETs a walkway if it exists', () => {
        return request.get(`/walkways/${hilly._id}`)
            .then(res => res.body)
            .then(walkway => assert.deepEqual(walkway, hilly));
    });

    it('returns 404 if walkway does not exist', () => {
        return request.get('/walkways/123412345567898765466676')
            .then(() => {
                throw new Error('received 200 code when should be 404');
            },
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
        return request.delete(`/walkways/${easy._id}`)
            .then(res => assert.deepEqual(res.body, { removed: true }));
    });

    it('returns removed: false if walkway not there to remove', () => {
        return request.delete(`/walkways/${easy._id}`)
            .then(res => assert.deepEqual(res.body, { removed: false }));
    });

    it('updates a walkway by id', () => {
        return request.put(`/walkways/${steep._id}`)
            .send({ length: 100 })
            .then(() => request.get(`/walkways/${steep._id}`))
            .then(res => assert.equal(res.body['length'], 100));
    });
});