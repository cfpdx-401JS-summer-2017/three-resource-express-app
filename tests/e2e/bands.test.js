const chai = require('chai');
const assert = chai.assert;
const chaiHttp = require('chai-http');
chai.use(chaiHttp);

process.env.MONGODB_URI = 'mongodb://localhost:27017/musicians-test';
require('../../lib/connect');

const connection = require('mongoose').connection;

const app = require('../../lib/app');
const request = chai.request(app);

describe('bands REST api', () => {
    before(() => connection.dropDatabase());

    const pinback = {
        name: 'Pinback',
        genre: 'Indie pop',
        members: [{
            name: 'Rob Crow',
            role: 'Guitarist'
        }, {
            name: 'Zack Smith',
            role: 'Bassist'
        }]
    };

    const blackSabbath = {
        name: 'Black Sabbath',
        genre: 'Metal',
        members: [{
            name: 'Ozzy Osbourne',
            role: 'Singer',
        }, {
            name: 'Tony Iommi',
            role: 'Guitarist'
        }, {
            name: 'Geezer Butler',
            role: 'Bassist'
        }, {
            name: 'Bill Ward',
            role: 'Drummer'
        }]
    };

    const beatles = {
        name: 'The Beatles',
        genre: 'Rock',
        members: [{
            name: 'Paul McCartney',
            role: 'Bassist'
        }, {
            name: 'John Lennon',
            role: 'Guitarist'
        }, {
            name: 'George Harrison',
            role: 'Guitarist'
        }, {
            name: 'Ringo Starr',
            role: 'Drummer'
        }]
    };

    function saveBand(band) {
        return request.post('/bands')
            .send(band)
            .then(({body}) => {
                band._id = body._id;
                return body;
            });
    }

    it('saves a band', () => {
        return saveBand(pinback)
            .then(savedBand => {
                assert.isOk(savedBand._id);
                assert.equal(savedBand.name, pinback.name);
                assert.equal(savedBand.genre, pinback.genre);
                assert.equal(savedBand.members.name, pinback.members.name);
            });
    });

    it('GETs band if it exists', () => {
        return request
            .get(`/bands/${pinback._id}`)
            .then(res => res.body)
            .then(band => {
                assert.ok(band._id);
                assert.equal(band.name, pinback.name);
            });
    });

    it('returns 404 if band does not exist', () => {
        return request.get('/bands/58ff9f496aafd447254c29b5')
            .then(
                () => {
                    throw new Error('successful status code not expected');
                },
                ({response}) => {
                    assert.ok(response.notFound);
                }
            );
    });

    it('GETs all bands', () => {
        return Promise.all([
            saveBand(blackSabbath),
            saveBand(beatles)
        ])
            .then(() => request.get('/bands'))
            .then(res => {
                const bands = res.body;
                assert.isTrue(bands.length === 3);
            });
    });

    it('updates an item by id with PUT request', () => {
        const nirvana = {
            name: 'Nirvana',
            genre: 'Grunge',
            members: [{
                name: 'Kurt Cobain',
                role: 'Guitarist'
            }, {
                name: 'Chris Novoselic',
                role: 'Bassist'
            }, {
                name: 'Dave Grohl',
                role: 'Drummer'
            }]
        };
        return request.put(`/bands/${beatles._id}`)
            .send(nirvana)
            .then(res => res.body)
            .then(band => {
                assert.equal(band.name, nirvana.name);
                assert.equal(band.genre, nirvana.genre);
            });
    });

    it('DELETES the band by id', () => {
        return request.delete(`/bands/${blackSabbath._id}`)
            .then(res => {
                assert.deepEqual(JSON.parse(res.text), {removed: true});
            });
    });
});