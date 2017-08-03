const Flower = require('../../lib/models/flower');
const { assert } = require('chai');

const expectedValidation = () => { throw new Error('expected validation errors'); };

describe('Flower model unit tests', () => {

    it('validates required fields', () => {
        const flower = new Flower({ name: 'Daisy' });
        return flower.validate();
    });

    describe('validation failures', () => {
        const flower = new Flower();
        return flower.validate()
            .then(expectedValidation, err => {
                const errors = err.errors;
                assert.ok(errors.name && errors.name.kind === 'required');
            });
    });
});

