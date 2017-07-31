const Restaurant = require('../../lib/models/restaurant');
const { assert } = require('chai');

describe('restaurant model', () => {
    
    it('validates the restaurant', () => {
        const restaurant = new Restaurant({
            name: 'meowmeow',
            address: {
                street: '123 Cat Street',
                city: 'party-town',
                state: 'RI',
                zip: 80908
            }
        });
        return restaurant.validate();
    });

    it('fails validation if required fields missing', () => {
        const restaurant = new Restaurant();
        return restaurant.validate()
            .then(
                () => { throw new Error('expected validation error');},
                ({ errors }) => {
                    assert.ok(errors.name);
                }
            );
    });
    
});