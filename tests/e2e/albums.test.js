const db = require('./helpers/db');
const request = require('./helpers/request');
const chai = require('chai');
const assert = chai.assert;
// const chaiHttp = require('chai-http');
// chai.use(chaiHttp);

// process.env.MONGODB_URI = 'mongodb://localhost:27017/musicians-test';
// require('../../lib/connect');

// const connection = require('mongoose').connection;

// const app = require('../../lib/app');
// const request = chai.request(app);

describe('albums REST api', () => {
    before(db.drop);
    let token = null;

    before(() => db.getToken().then(t => token = t));

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
            .set('Authorization', token)
            .send(album)
            .then(({body}) => {
                album._id = body._id;
                // album.__v = body.__v;
                return body;
            });
    }

    it('saves an album', () => {
        return saveAlbum(album1)
            .then(savedAlbum => {
                assert.isOk(savedAlbum._id);
                assert.equal(savedAlbum.name, album1.name);
                assert.equal(savedAlbum.genre, album1.genre);
                assert.equal(savedAlbum.year, album1.year);
            });
    });

    it('GETs album if it exists', () => {
        return request
            .get(`/albums/${album1._id}`)
            .set('Authorization', token)
            .then(res => res.body)
            .then(album => { 
                assert.ok(album._id);
                assert.equal(album.name, album1.name);
                
            });
    });

    it('returns 404 if album does not exist', () => {
        return request.get('/albums/58ff9f496aafd447254c29b5')
            .set('Authorization', token)
            .then(
                () => {
                    throw new Error('successful status code not expected');
                },
                ({ response }) => {
                    assert.ok(response.notFound);
                }
            );
    });

    it('GETs all albums', () => {
        return Promise.all([
            saveAlbum(album2),
            saveAlbum(album3),
        ])
            .then(() => request.get('/albums')
                .set('Authorization', token))
            .then(res => {
                const albums = res.body;
                assert.deepEqual(albums, [album1,album2,album3]);
            });
    });

    it('updates an item by id with PUT request', () => {
        const rageAgainstTheMachine = {
            name: 'Battle for Los Angeles',
            genre: 'Rap',
            year: 2000,
            tracks: 13
        };
        return request.put(`/albums/${album3._id}`)
            .set('Authorization', token)
            .send(rageAgainstTheMachine)
            .then(res => res.body)
            .then(album => {
                assert.equal(album.name, rageAgainstTheMachine.name);
                assert.equal(album.genre, rageAgainstTheMachine.genre);
            });
    });

    it('DELETES the album by id', () => {
        return request.delete(`/albums/${album3._id}`)
            .set('Authorization', token)
            .then (res => {
                assert.deepEqual(JSON.parse(res.text), {removed: true});
            });
    });
});