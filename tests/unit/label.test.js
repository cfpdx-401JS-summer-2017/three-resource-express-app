const Label = require('../../lib/models/label');
const {assert} = require('chai');

describe('Label model', () => {
    it('validates the required fields', () => {
        const label = new Label({
            name: 'Quote Unquote',
            location: {
                country: 'USA',
                city: 'Brooklyn'
            },
            size: 'diy'
        });
        return label.validate();
    });

    it('fails validation when required fields are missing', () => {
        const label = new Label();

        return label.validate()
            .then(
                () => {throw new Error('Expected validation error');},
                ({errors}) => {
                    assert.ok(errors.name);
                    assert.ok(errors.size);
                }
            );
    });
});