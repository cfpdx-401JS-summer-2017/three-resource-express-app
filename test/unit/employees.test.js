const Employee = require('../../lib/models/employee');

const { assert } = require('chai');

describe('Employee model', () => {

    it('validates with required fields', () => {
        const bill = new Employee({
            name: 'Bill',
            role: {
                roleName: 'operator',
                rate: 48.63,
                hours: 244
            },
            hireDate: 'Sept. 03, 3007'
        });

        return bill.validate();
    });

    it('fails validation when required fields are missing', () => {
        const steve = new Employee();

        return steve.validate()
            .then(
                () => { throw new Error('Expected Validation Error'); },
                ({ errors }) => {
                    assert.ok(errors.name);
                }
            );
    });
});