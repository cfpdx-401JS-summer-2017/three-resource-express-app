const Taco = require('../../lib/models/taco');
const { assert } = require('chai');

describe('Taco model', () => {
    
    it('validates the taco', () => {
        const taco = new Taco({
            name: 'mucho spicy',
            type: 'pork',
            cheese: true,
            toppings: 'lettuce'
        });
        return taco.validate();
    });

    it('fails validation if required fields missing', () => {
        const taco = new Taco();
        return taco.validate()
            .then(
                () => { throw new Error('expected validation error');},
                ({ errors }) => {
                    assert.ok(errors.name);
                    assert.ok(errors.type);
                }
            );
    });

    it('type should be of enum type', () => {
        const taco = new Taco({
            name: 'foo',
            type: 'bacon'
        });

        return taco.validate()
            .then(
                () => { throw new Error('expected validation error');},
                ({ errors }) => {
                    assert.equal(errors.type.kind, 'enum');
                }
            );
    });
});
