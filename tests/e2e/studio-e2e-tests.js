const chai = require('chai');
const assert = chai.assert;
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
require('../../lib/connect');
const connection = require('mongoose').connection;
const app = require('../../lib/app');
const request = chai.request(app);


describe('studio REST api', () => {

    const testStudio = {
        name: 'Studio Fantastico',
        address: {
            city: 'Krakow',
            state: '',
            country: 'Poland'
        }
    };

    const testActor = {
        name: 'Noodly McNoodleface',
        dob: new Date('1987', '11', '11'),
        pob: 'Exeter, New Hampshire'
    };

    const testActor2 = {
        name: 'McCaully Culkin',
        dob: new Date('1992', '03', '11'),
        pob: 'Vale, CO'
    };

    let testFilm = {
        title: 'The Greatest Film Ever',
        studio: null,
        released: 1997,
        cast: [{
            role: 'Mayor of Mystery',
            actor: null
        }]
    };

    let testFilm2 = {
        title: 'The Third Greatest Film Ever',
        studio: null,
        released: 2007,
        cast: [{
            role: 'Mayor of Mystery',
            actor: null
        }, {
            role: 'Comptroller of Contempt',
            actor: null
        }]
    };

    const siskel = {
        name: 'Siskel',
        company: 'filmflappers.net'
    };

    const ebert = {
        name: 'Ebert',
        company: 'cinemanima.world'
    };

    let testStudio2;

    function saveActor(actor) {
        return request.post('/actors')
            .send(actor)
            .then(({ body }) => {
                actor._id = body._id;
                actor.__v = body.__v;
                return body;
            });
    }

    function saveStudio(studio) {
        return request.post('/studios')
            .send(studio)
            .then(({ body }) => {
                studio._id = body._id;
                studio.__v = body.__v;
                return body;
            });
    }

    function saveFilm(film) {
        return request.post('/films')
            .send(film)
            .then(({ body }) => {
                film._id = body._id;
                film.__v = body.__v;
                return body;
            });
    }

    before(() => {
        return connection.dropDatabase()
            .then(() => {
                return Promise.all([
                    saveActor(testActor),
                    saveActor(testActor2),
                    saveStudio(testStudio)
                ])
                    .then(savedStuff => {
                        // console.log(99, savedStuff)
                        testFilm.studio = savedStuff[2]._id;
                        testFilm.cast[0].actor = savedStuff[2]._id;
                        testFilm2.studio = savedStuff[2]._id;
                        testFilm2.cast[0].actor = savedStuff[0]._id;
                        testFilm2.cast[1].actor = savedStuff[1]._id;
                        return Promise.all([
                            saveFilm(testFilm),
                            saveFilm(testFilm2)
                        ]);
                    });
            });
    });

    it('saves a studio', () => {
        testStudio2 = {
            name: 'Eeaher Pics',
            address: {
                city: 'Burbank',
                state: 'AK',
                country: 'Poland'
            }
        };
        return saveStudio(testStudio2)
            .then(savedStudio => {
                assert.ok(savedStudio._id);
                assert.equal(savedStudio.name, testStudio2.name);
                assert.equal(savedStudio.address.city, 'Burbank');
            });
    });

    it('gets a studio by id', () => {
        return request.get(`/studios/${testStudio._id}`)
            .then(res => {
                let gotStudio = res.body;
                assert.equal(gotStudio._id, testStudio._id);
                assert.equal(gotStudio.name, testStudio.name);
                assert.deepEqual(gotStudio.address, testStudio.address);
            });
    });

    it('updates a studio', () => {
        return request.put(`/studios/${testStudio._id}`)
            .send({ name: 'Ocukys Pictures' })
            .then(res => {
                let rxn = res.body;
                assert.deepEqual(rxn, { modified: true });
            });
    });

    it.skip('deletes a studio only if it has no films', () => {
        return request.delete(`/studios/${testStudio2._id}`)
            .then(res => {
                assert.deepEqual(res.body, { removed: true });
            });
    });

    it.skip('errors out if delete req for studio with films', () => {
        return request.delete(`/studios/${testStudio._id}`)
            .then(res => {
                assert.deepEqual(res.body, { removed: false });
            });
    });
});