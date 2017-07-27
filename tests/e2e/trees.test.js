const chai = require('chai');
const assert = chai.assert;
const chaiHttp = require('chai-http');
chai.use(chaiHttp);

process.env.MONGODB_URL = 'mongodb://localhost:27017/arboretum-test';
require('../../lib/connect');

const connection = require('mongoose').connection;
const app = require('../../lib/app');
const request = chai.request(app);

describe('REST API for trees', () => {

    before(() => connection.dropDatabase());

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
        return request.post('/trees')
            .send(tree)
            .then(({ body }) => {
                tree._id = body._id;
                tree.__v = body.__v;
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






});