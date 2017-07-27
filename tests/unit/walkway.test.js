const Walkway = require('../../lib/models/walkway');
const { assert } = require('chai');

describe('Walkway model unit tests', () => {
    it('validates with required fields', () => {
        const walkway = new Walkway({
            type: 'hilly',
        });
        return walkway.validate();
    });

    it('fails validation when the required fields are missing', () => {
        const walkway = new Walkway();

        return walkway.validate()
            .then(
                () => { 
                    throw new Error('Expected validation error'); 
                },
                ({ errors }) => {
                    assert.equal(errors.type.kind, 'required');
                    assert.ok(errors.type);
                }
            );
    });

    it('type should be enum', () => {
        const walkway = new Walkway({
            type: 'fake',
        });

        return walkway.validate()
            .then(() => {
                throw new Error('Expected validation error');
            }, ({ errors }) => assert.equal(errors.type.kind, 'enum'));
    });

    it('type should be number', () => {
        const walkway = new Walkway({
            type: 'hilly',
            length: 'fake',
        });

        return walkway.validate()
            .then(() => {
                throw new Error('Expected validation error');
            }, ({ errors }) => {
                assert.deepEqual(errors['length'].kind, 'Number');
            }
            );
    });











});