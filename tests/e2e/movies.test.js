const db = require('./helpers/db');
const request = require('./helpers/request');
const assert = require('chai').assert;

describe('movies REST api',()=>{
    
    before(db.drop);

    let token = null;
    before(() => db.getToken().then(t => token = t));

    const jurassicPark = {
        title: 'Jurassic Park',
        year: 1993,
        genre: 'thriller',
        cast: [
            'Sam Neill',
            'Laura Dern',
            'Jeff Goldblum'
        ]
    };

    const somLH = {
        title: 'Some Like it Hot',
        year: 1959,
        genre: 'comedy',
        cast: [
            'Marilyn Monroe',
            'Tony Curtis',
            'Jack Lemmon'
        ]
    };
    
    const hhelv = {
        title: 'Hellvetica',
        year: 3015,
        cast: []
    };
    const helv = {
        title :'Helvetica',
        year: 2007,
        cast: []

    };
    function saveMovie(movie) {
        return request.post('/movies')
            .set('Authorization', token)
            .send(movie)
            .then(({body}) => {
                movie._id = body._id;
                movie.__v = body.__v;
                return body;
            });

    }
    it('saves a movie', () => {
        return saveMovie(jurassicPark)
            .then(savedMovie => {
                assert.isOk(savedMovie._id);
                assert.equal(savedMovie.title, jurassicPark.title);
                assert.equal(savedMovie.year, jurassicPark.year);
            });
    });

    it('GETs movie if it exists', () => {
        return request
            .get(`/movies/${jurassicPark._id}`)
            .set('Authorization', token)
            .then(res => res.body)
            .then(movie => {
                assert.equal(movie.title, jurassicPark.title);
                assert.equal(movie.year, jurassicPark.year);
            });
    });

    it('returns 404 if movie does not exist', () => {
        return request.get('/movies/58ff9f496aafd447254c29b5')
            .set('Authorization', token)
            .then(
                () => {
                //resolve
                    throw new Error('successful status code not expected');
                },
                ({ response }) => {
                //reject
                    assert.ok(response.notFound);
                    assert.isOk(response.error);
                }
            );
    });

    it('GET all movies', () => {
        return Promise.all([
            saveMovie(somLH),
            saveMovie(hhelv),
        ])
            .then(() => request.get('/movies')
                .set('Authorization', token))
            .then(res => {
                const movies = res.body;
                assert.deepEqual(movies, [jurassicPark, somLH, hhelv]);
            });
    });
    it('rewrites movie data by id', ()=>{
        return request.put(`/movies/${hhelv._id}`)
            .set('Authorization', token)
            .send(helv)
            .then(res => {
                assert.isOk(res.body._id);
                assert.equal(res.body.name,helv.name);
                assert.equal(res.body.age,helv.age);
            });
    });
    it('deletes movie by id', () =>{
        return request.delete(`/movies/${somLH._id}`)
            .set('Authorization', token)
            .then(res => {
                assert.deepEqual(JSON.parse(res.text), { removed: true });
            });
    });
    it('fails to delete movie by id', () =>{
        return request.delete(`/movies/${somLH._id}`)
            .set('Authorization', token)
            .then(res => {
                assert.deepEqual(JSON.parse(res.text), { removed: false });
            });
    });
            
});