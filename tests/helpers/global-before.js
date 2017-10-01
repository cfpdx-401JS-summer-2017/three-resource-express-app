process.env.MONGODB_URI = 'mongodb://localhost:27017/3resource';
require('../../lib/connect');
const connection = require('mongoose').connection;
const testHelper = require('./test-helper');
const db = require('./db');

before(() => {
  connection;
  db.dropDb();

  let testStudio = testHelper.studio;
  let testActor = testHelper.actor;
  let testFilm = testHelper.film;

  return Promise.all([
    testHelper.saveStudio(testStudio).then(studio => (testStudio = studio)),
    testHelper.saveActor(testActor).then(actor => (testActor = actor))
  ])
    .then(() => {
      testFilm.cast[0].actor = testActor._id;
      testFilm.studio = testStudio._id;
      // return testHelper.saveFilm(testFilm);
      return testFilm;

    })
    .then(film => {
      testFilm = film;
      return testFilm;
    })

});
