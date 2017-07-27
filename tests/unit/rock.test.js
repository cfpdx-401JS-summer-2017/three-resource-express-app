const Rock = require('../../lib/models/rock');
const { assert } = require('chai');

describe('Rock model unit tests', () => {
    it('validates with required fields', () => {
        const rock = new Rock({
            type: 'basalt',
        });
        return rock.validate();
    });

    it('fails validation when required fields are missing', () => {
        const rock = new Rock();

        return rock.validate()
            .then(() => {
                throw new Error('Expected validation error');
            }, ({ errors }) => {
                assert.equal(errors.type.kind, 'required');
                assert.ok(errors.type);
            });
    });
});