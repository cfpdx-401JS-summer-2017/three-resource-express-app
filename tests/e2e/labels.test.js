const chai = require('chai');
const assert = chai.assert;
const chaiHttp = require('chai-http');
chai.use(chaiHttp);

process.env.MONGODB_URI = 'mongodb://localhost:27017/musicians-test';
require('../../lib/connect');

const connection = require('mongoose').connection;

const app = require('../../lib/app');
const request = chai.request(app);

describe('labels REST api', () => {
    before(() => connection.dropDatabase());

    const quoteUnquote = {
        name: 'Quote Unquote',
        location: 'Brooklyn',
        size: 'diy'
    };

    const subPop = {
        name: 'Sub Pop',
        location: 'Seattle',
        size: 'indie'
    };

    const warnerBrothers = {
        name: 'Warner Brothers',
        location: 'Probably California',
        size: 'major'
    };

    function saveLabel(label) {
        return request.post('/labels')
            .send(label)
            .then(({body}) => {
                label._id = body._id;
                return body;
            });
    }

    it('saves a label', () => {
        return saveLabel(quoteUnquote)
            .then(savedLabel => {
                assert.isOk(savedLabel._id);
                assert.equal(savedLabel.name, quoteUnquote.name);
                assert.equal(savedLabel.size, quoteUnquote.size);
            });
    });

    it('GETs a label if it exists', () => {
        return request
            .get(`/labels/${quoteUnquote._id}`)
            .then(res => res.body)
            .then(label => {
                assert.ok(label._id);
                assert.equal(label.name, quoteUnquote.name);
            });
    });

    it('returns 404 if label does not exist', () => {
        return request.get('/labels/58ff9f496aafd447254c29b5')
            .then(
                () => {
                    throw new Error('successful status code not expected');
                },
                ({response}) => {
                    assert.ok(response.notFound);
                }
            );
    });

    it('GETs all labels', () => {
        return Promise.all([
            saveLabel(subPop),
            saveLabel(warnerBrothers)
        ])
            .then(() => request.get('/labels'))
            .then(res => {
                const labels = res.body;
                assert.isTrue(labels.length === 3);
            });
    });

    it('updates an item by id with PUT request', () => {
        const cheeseburger = {
            name: 'Cheeseburger Records',
            location: {
                country: 'USA',
                city: 'Los Angeles'
            },
            size: 'indie'
        };
        return request.put(`/labels/${warnerBrothers._id}`)
            .send(cheeseburger)
            .then(res => res.body)
            .then(label => {
                assert.equal(label.name, cheeseburger.name);
                assert.equal(label.size, cheeseburger.size);
            });
    });

    it('DELETES the label by id', () => {
        return request.delete(`/labels/${warnerBrothers._id}`)
            .then(res => {
                assert.deepEqual(JSON.parse(res.text), {removed: true});
            });
    });
});