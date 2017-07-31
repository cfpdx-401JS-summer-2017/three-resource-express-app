const Machine = require('../../lib/models/machine');

const { assert } = require('chai');

describe('Machine model', () => {

    it('validates with required fields', () => {
        const dozer = new Machine({
            type: 'bulldozer',
            weight: 60000,
            width: {
                feet: 8,
                inches: 4
            },
            brand: 'John Deere'
        });

        return dozer.validate();
    });

    it('fails validation when required fields are missing', () => {
        const machine = new Machine();

        return machine.validate()
            .then(
                () => { throw new Error('Expected Validation Error'); },
                ({ errors }) => {
                    assert.ok(errors.type);
                    assert.ok(errors.weight);
                }
            );
    });
});