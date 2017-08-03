const Salsa = require('../../lib/models/salsa');
const { assert } = require('chai');

describe('salsa model', () => {

    it('validates the salsa', () => {
        const salsa = new Salsa({
            name: 'salsa verde',
            type: 'green',
            howSpicy: 'medium'
        });
        return salsa.validate();
    });

    it('fails validation if required fields are missing', () => {
        const salsa = new Salsa();
        return salsa.validate()
            .then(() => { throw new Error('expected validation error'); },
                ({ errors }) => {
                    assert.ok(errors.name);
                    assert.ok(errors.type);
                    assert.ok(errors.howSpicy);
                });
    });

    it('should be of enum type', () => {
        const salsa = new Salsa({
            name: 'awesome salsa',
            type: 'yellow',
            howSpicy: 'none'
        });

        return salsa.validate()
            .then(() => { throw new Error('expected validation error'); },
                ({ errors }) => {
                    assert.equal(errors.type.kind, 'enum');
                    assert.equal(errors.howSpicy.kind, 'enum');
                });
    });
});