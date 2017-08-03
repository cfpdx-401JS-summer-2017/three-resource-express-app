const db = require('./helpers/db');
const request = require('./helpers/request');
const assert = require('chai').assert;

describe('flowers api', () => {

    before(db.drop);

    let token = null;
    before(() => db.getToken().then(t => token = t));

    let daisy = {
        name: 'Daisy',
        color: 'white'
    };

    let rose = {
        name: 'Rose',
        color: 'red'
    };

    let poppy = {
        name: 'Poppy',
        color: 'orange'
    };

    function saveFlower(flower) {
        return request 
            .post('/api/flowers')
            .set('Authorization', token)
            .send(flower)
            .then(({ body }) => {
                flower._id = body._id;
                flower.__v = body.__v;
                return body;
            });
    }

    it('saves a flower', () => {
        return saveFlower(daisy)
            .then(savedFlower => {
                assert.ok(savedFlower._id);
                assert.deepEqual(savedFlower, daisy);
            });
    });

    it('GETs a flower if it exists', () => {
        return request.get(`/api/flowers/${daisy._id}`)
            .set('Authorization', token)
            .then(res => res.body)
            .then(flower => assert.deepEqual(flower, daisy));
    });

    it('returns 404 if flower does not exist', () => {
        return request.get('/api/flowers/123412345567898765466676')
            .set('Authorization', token)
            .then(() => { throw new Error('received 200 code when should be 404'); },
                ({ response }) => assert.ok(response.notFound && response.error));
    });

    it('errors without authorization', () => {
        return request.get(`/api/flowers/${daisy._id}`)
            .then(() => { throw new Error('Unauthorized'); },
                ({ response }) => assert.equal(response.body.error, 'No Authorization Found'));
    });

    it('GETs all flowers', () => {
        return Promise.all([
            saveFlower(rose),
            saveFlower(poppy)
        ])
            .then(savedFlowers => {
                rose = savedFlowers[0];
                poppy = savedFlowers[1];
            })
            .then(() => request
                .get('/api/flowers')
                .set('Authorization', token)    
            )
            .then(res => res.body)
            .then(res => res.sort((a,b) => {
                if(a.name > b.name) return 1;
                else if(a.name < b.name) return -1;
            }))
            .then(flowers => assert.deepEqual(flowers, [daisy, poppy, rose])
            );
    });


    it('errors on validation failure', () => {
        return saveFlower({})
            .then(() => { throw new Error('expected failure'); },
                () => { }
            );
    });
});