const { assert } = require('chai');
const Contact = require('../../lib/models/contact');

describe('Contact model', () => {

    it('validates with required fields', () => {
        const contact = new Contact({
            name: 'Joel',
            employer: 'Nike',
            connected: 'Email'
        });
        
        return contact.validate();
    });

    it('validation fails without required fields', () => {
        const contact = new Contact();

        return contact.validate()
            .then(
                () => { throw new Error('Expected validation error'); },
                ({ errors }) => {
                    assert.ok(errors.name);
                    assert.ok(errors.employer);
                    assert.ok(errors.connected);
                }
            );
    });

});
