const Studio = require('../../lib/models/studio');

const {assert} = require('chai');
describe('studio model', () => {
    it('validates with required fields', () =>{
        const studio = new Studio({
            name: 'MGM Studios',
            address: {
                city: 'Beverly Hills',
                state: 'CA',
                zip: 90210
            }
        });
        return studio.validate();
    });
    it('fails validation when required fields are missing', () => {
        const studio = new Studio();
        
        return studio.validate()
            .then(
                () => { throw new Error('Expected validation error'); },
                ({ errors }) => {
                    assert.ok(errors.name);
                    assert.ok(errors.age);
                }
            );
    });

});