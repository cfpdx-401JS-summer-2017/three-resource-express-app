
const School = require('../../lib/models/school');
const { assert } = require('chai');

describe('school model', () => {

    it('passes validation with required fields', () => {
        const school = new School({
            name: 'PSU',
            zip: 97229
        });
        return school.validate();
    });

    it('fails validation with missing required fields', () => {
        const school = new School();
            
        return school.validate()
            .then(
                () => { throw new Error('Expected validation error'); },
                ({ errors }) => {
                    assert.ok(errors.name);
                }

            );
    });

    it('fails validation with incorrect field type', () => {
        const school = new School({
            name: 'PSU',
            zip: 'not a number'
        });
        return school.validate()
            .then(
                () => { throw new Error('Expected validation error'); },
                ({ errors }) => {
                    assert.ok(errors.zip);
                }
            );
    });
});