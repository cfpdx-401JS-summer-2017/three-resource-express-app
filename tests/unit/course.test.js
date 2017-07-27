
const Course = require('../../lib/models/course');
const { assert } = require('chai');

describe('Course model', () => {

    it('passes validation with required fields', () => {
        const course = new Course({
            title: 'Writing 121',
            courseId: 'W-121'
        });
        return course.validate();
    });

    it('fails validation with missing required fields', () => {
        const course = new Course();
            
        return course.validate()
            .then(
                () => { throw new Error('Expected validation error'); },
                ({ errors }) => {
                    assert.ok(errors.title);
                    assert.ok(errors.courseId);
                }

            );
    });
});