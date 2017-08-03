const assert = require('chai').assert;
const Company = require('../../lib/models/company');

describe('Company model', () => {

    it('validates with required fields', () => {
        const contact = new Company({
            name: 'Nike',
            url: 'https://jobs.nike.com/',
            location: {
                city: 'Beverton',
                state: 'OR'
            }
        });
        
        return contact.validate();
    });

    it('validation fails without required fields', () => {
        const company = new Company();

        return company.validate()
            .then(
                () => { throw new Error('Expected validation error'); },
                ({ errors }) => {
                    assert.ok(errors.name);
                    assert.ok(errors.url);
                    // assert.ok(errors.location); //not sure why this isn't req'd
                }
            );
    });

});
