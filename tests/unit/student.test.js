
const Student = require('../../lib/models/student');
const { assert } = require('chai');

describe('Student model', () => {

    it('passes validation with required fields', () => {
        const student = new Student({
            name: 'Scott Tilden',
        });
        return student.validate();
    });

    it('fails validation with missing required fields', () => {
        const student = new Student({
            name: null,
        });
        return student.validate()
            .then(
                () => { throw new Error('Expected validation error'); },
                ({ errors }) => {
                    assert.ok(errors.name);
                }

            );
    });

    it('fails validation with incorrect field type', () => {
        const student = new Student({
            name: {},
        });
        return student.validate();
    });

});