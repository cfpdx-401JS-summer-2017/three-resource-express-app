const assert = require('chai').assert;
const Job = require('../../lib/models/job');

describe('Job model', () => {

    it('validates with required fields', () => {
        const job = new Job({
            position: 'Web Developer',
            company: 'Google, Inc.',
            applied: true
        });
        
        return job.validate();
    });

    it('validation fails without required fields', () => {
        const job = new Job();

        return job.validate()
            .then(
                () => { throw new Error('Expected validation error'); },
                ({ errors }) => {
                    assert.ok(errors.position);
                    assert.ok(errors.company);
                    assert.ok(errors.applied);
                }
            );
    });

    // it('validates ', () => {
        
    // });

});