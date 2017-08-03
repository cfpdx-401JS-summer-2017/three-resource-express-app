const db = require('./helpers/db');
const request = require('./helpers/request');
const { assert } = require('chai');

describe('restaurant REST api', () => {
    before(db.drop);

    const tacoBell = {
        name: 'taco bell',
        address: {
            street: '900 sw taco st',
            city: 'tacotown',
            state: 'TX',
            zip: 56799
        }
    };

    const judas = {
        name: 'judas',
        address: {
            street: '100 sketchy st',
            city: 'betrayerville',
            state: 'NB',
            zip: 66666
        }
    };

    function saveRestaurant(restaurant) {
        return request.post('/restaurants')
            .send(restaurant)
            .then(({ body }) => {
                restaurant._id = body._id;
                restaurant.__v = body.__v;
                return body;
            });
    }

    it('saves a restaurant', () => {
        return saveRestaurant(judas)
            .then(savedRestaurant => {
                assert.isOk(savedRestaurant._id);
                assert.deepEqual(savedRestaurant, judas);
            });
    });

    it('gets restaurant if it exists', () => {
        return request 
            .get(`/restaurants/${judas._id}`)
            .then(res => res.body)
            .then(restaurant => {
                assert.deepEqual(restaurant, judas);
            });
    });

    it('gets all restaurants', () => {
        return Promise.all([
            saveRestaurant(tacoBell)
        ])
            .then(() => request.get('/restaurants'))
            .then(res => {
                const restaurants = [res.body[0].name, res.body[1].name];
                assert.deepEqual(restaurants, [judas.name, tacoBell.name]);
            });
    });

    it('deletes a restaurant by id', () => {
        return request.delete(`/restaurants/${tacoBell._id}`)
            .then(res => {
                const message = JSON.parse(res.text);
                assert.deepEqual(message, { removed: true});
            });
    }); 
        
    it('updates an existing restaurant', () => {
        return request.put(`/restaurants/${judas._id}`)
            .send({ name: 'baby judas'})
            .then(() => {
                return request.get(`/restaurants/${judas._id}`);                
            })
            .then(res => {
                const updatedRestaurant = res.body;
                assert.equal(updatedRestaurant.name, 'baby judas');
            });
    });
});