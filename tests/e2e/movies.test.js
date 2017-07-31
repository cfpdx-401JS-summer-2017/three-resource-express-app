const chai = require('chai');
const assert = chai.assert;
const chaiHttp = require('chai-http');
chai.use(chaiHttp);

process.env.MONGODB_URI = 'mongodb://localhost:27017/hollywood-test';

require('../../lib/connect');

const connection = require('mongoose').connection;

const app = require('../../lib/app');

const request = chai.request(app);

describe('movies REST api',()=>{
    before(() => connection.dropDatabase());

    const jarasP = {
        title: 'Jurassic Park',
        year: 1993,
        genre: 'thriller',
        cast: [
            'Sam Neill',
            'Laura Durn',
            'Jeff Goldbloom'
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
            .send(movie)
            .then(({body}) => {
                movie._id = body._id;
                movie.__v = body.__v;
                return body;
            });

    }
    it('saves a movie', () => {
        return saveMovie(jarasP)
            .then(savedMovie => {
                assert.isOk(savedMovie._id);
                assert.equal(savedMovie.title, jarasP.title);
                assert.equal(savedMovie.year, jarasP.year);
            });
    });

    it('GETs movie if it exists', () => {
        return request
            .get(`/movies/${jarasP._id}`)
            .then(res => res.body)
            .then(movie => {
                assert.equal(movie.title, jarasP.title);
                assert.equal(movie.year, jarasP.year);
            });
    });

    it('returns 404 if movie does not exist', () => {
        return request.get('/movies/58ff9f496aafd447254c29b5').then(
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
            .then(() => request.get('/movies'))
            .then(res => {
                const movies = res.body;
                assert.deepEqual(movies, [jarasP, somLH, hhelv]);
            });
    });
    it('rewrites movie data by id', ()=>{
        return request.put(`/movies/${hhelv._id}`)
            .send(helv)
            .then(res => {
                assert.isOk(res.body._id);
                assert.equal(res.body.name,helv.name);
                assert.equal(res.body.age,helv.age);
            });
    });
    it('deletes movie by id', () =>{
        return request.delete(`/movies/${somLH._id}`)
            .then(res => {
                assert.deepEqual(JSON.parse(res.text), { removed: true });
            });
    });
    it('fails to delete movie by id', () =>{
        return request.delete(`/movies/${somLH._id}`)
            .then(res => {
                assert.deepEqual(JSON.parse(res.text), { removed: false });
            });
    });
            
});