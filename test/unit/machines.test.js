const Machine = require('../../lib/models/machine');
const { assert } = require('chai');

describe('Machine model', () => {
    it('validates with required fields', () => {
        const dozer = new Machine({
            type: dozer,
            weight: 60000,
            width: {
                feet: 8,
                inches: 4
            },
            brand: 'John Deere'
        });

        return dozer.validate();

    });
});