const chai = require('chai');
const assert = chai.assert;
const chaiHttp = require('chai-http');
chai.use(chaiHttp);

process.env.MONGODB_URI = 'mongodb://localhost:27017/musicians-test';
require('../../lib/connect');

const connection = require('mongoose').connection;

const app = require('../../lib/app');
const request = chai.request(app);

describe('albums REST api', () => {
    before(() => connection.dropDatabase());

    const album1 = {
        name: 'Appetite For Destruction',
        genre: 'Rock',
        year: 1987,
        tracks: 15
    };

    const album2 = {
        name: 'Journey Greatest Hits',
        genre: 'Anthem Pop',
        year: 2010,
        tracks: 30
    };

    const album3 = {
        name: 'Blue Screen Life',
        genre: 'Indie Pop',
        year: 2001,
        tracks: 12
    };

    function saveAlbum(album) {
        return request.post('/albums')
            .send(album)
            .then(({body}) => {
                album._id = body._id;
                album.__v = body.__v;
                return body;
            });
    }

    it('saves an album', () => {
        return saveAlbum(album1)
            .then(savedAlbum => {
                assert.isOk(savedAlbum._id);
                assert.deepEqual(savedAlbum, album1);
            });
    });

    it('GETs album if it exists', () => {
        return request
            .get('/albums/${album1._id}')
            .then(res => res.body)
            .then(album => assert.deepEqual(album, album1));
    });

    it('returns 404 if album does not exist', () => {
        return request.get('/albums/58ff9f496aafd447254c29b5').then(
            () => {
                throw new Error('successful status code not expected');
            },
            ({response}) => {
                assert.ok(response.notFound);
                assert.isOk(response.body.error);
            }
        );
    });

    it('GETs all albums', () => {
        return Promise.all([
            saveAlbum(album2),
            saveAlbum(album3),
        ])
            .then(() => request.get('/albums'))
            .then(res => {
                const albums = res.body;
                assert.deepEqual(albums, [album1,album2,album3]);
            });
    });
});