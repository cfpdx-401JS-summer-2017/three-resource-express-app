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

    const steep = {
        type: 'steep'
    };

    const easy = {
        type: 'easy'
    };

    function saveWalkway(walkway) {
        return request.post('/walkways')
            .send(walkway)
            .then(({ body }) => {
                walkway._id = body._id;
                walkway.__v = body.__v;
                walkway.type = body.type;
                walkway.length = body.length;
                walkway.composition = body.composition;
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
});