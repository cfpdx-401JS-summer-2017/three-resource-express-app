const app = require('../../lib/app');
const chai = require('chai');
const assert = chai.assert;
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const req = chai.request(app);
const testHelper = require('../helpers/test-helper');
const { dropDb } = require('../helpers/db');

describe('film e2e tests', () => {
  let testStudio = testHelper.studio;
  let testFilm = testHelper.film;
  before(() => dropDb());

  it('POST /film', () => {
    testFilm.studio = testStudio;
    return req
      .post('/films')
      .send(testFilm)
      .then(savedFilm => {
        assert.equal(savedFilm.body.title, 'The Greatest Film Ever');
      });
  }),
    it('GET /films', () => {
      return req.get('/films').then(films => {
        assert.lengthOf(films.body, 1);
      });
    }),
    it('GET /film by id', () => {
      return req
        .post('/films')
        .send(testFilm)
        .then(savedFilm => {
          return savedFilm.body._id;
        })
        .then(savedId => {
          return req.get(`/films/${savedId}`).then(res => {
            assert.equal(res.body.title, 'The Greatest Film Ever');
            assert.equal(res.body._id, savedId);
          });
        });
    }),
    it('DELETE /films by id', () => {
      return req
        .post('/films')
        .send(testFilm)
        .then(savedFilm => {
          return savedFilm.body._id;
        })
        .then(savedId => {
          return req.delete(`/films/${savedId}`).then(res => {
            assert.equal(res.status, 200);
          });
        });
    }),
    it('PATCH /films', () => {
      return req
        .post('/films')
        .send(testFilm)
        .then(savedFilm => {
          return savedFilm.body._id;
        })
        .then(savedId => {
          return req
            .patch(`/films/${savedId}`)
            .send({ id: savedId, newTitle: 'The Worst Film Ever' })
            .then(res => {
              assert.equal(res.statusCode, 200);
            });
        });
    });
});
