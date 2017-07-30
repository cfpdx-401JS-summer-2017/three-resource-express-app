const chai = require('chai');
const assert = chai.assert;
const chaiHttp = require('chai-http');
chai.use(chaiHttp);

process.env.MONGODB_URL = 'mongodb://localhost:27017/arboretum-test';
require('../../lib/connect');

const connection = require('mongoose').connection;
const app = require('../../lib/app');
const request = chai.request(app);

describe('REST API for rocks', () => {

    before(() => connection.dropDatabase());

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
        return request.post('/rocks')
            .send(rock)
            .then(({ body }) => {
                rock._id = body._id;
                rock.__v = body.__v;
                rock.colors = body.colors;
                rock.size = body.size;
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
        return request.get('/rocks/count')
            .then(count => assert.ok(count.body));
    });


});
