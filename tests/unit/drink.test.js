const Drink = require('../../lib/models/drink');
const { assert } = require('chai');

describe('Drink model', () => {

    it('validates the drink', () => {
        const drink = new Drink({
            name: 'purple drank',
            type: 'wine',
            size: 32
        });
        return drink.validate();
    });

    it('fails validation if required field is missing', () => {
        const drink = new Drink();
        return drink.validate()
            .then(
                () => { throw new Error('expected validation error'); },
                ({ errors }) => {
                    assert.ok(errors.name);
                }
            );

    });

    it('type should be of enum type', () => {
        const drink = new Drink({
            name: 'foo',
            type: 'bar'
        });

        return drink.validate()
            .then(
                () => { throw new Error('expected validation error'); },
                ({ errors }) => {
                    assert.equal(errors.type.kind, 'enum');
                }
            );
    });
});