const Tree = require('../../lib/models/tree');
const { assert } = require('chai');

describe('Tree model unit tests', () => {
    it('validates with required fields', () => {
        const tree = new Tree({
            variety: 'Oak',
            type: 'deciduous',
        });
        return tree.validate();
    });

    it('fails validation when the required fields are missing', () => {
        const tree = new Tree();

        return tree.validate()
            .then(
                () => { 
                    throw new Error('Expected validation error'); 
                },
                ({ errors }) => {
                    assert.ok(errors.variety);
                    assert.ok(errors.type);
                }
            );
    });

    it('type should be enum', () => {
        const tree = new Tree({
            variety: 'Oak',
            type: 'fake',
            locations: ['North America', 'South America'],
            bark: [
                { texture: 'smooth' },
                { color: 'grey' }
            ]
        });

        return tree.validate()
            .then(() => {
                throw new Error('Expected validation error');
            }, ({ errors }) => assert.equal(errors.type.kind, 'enum'));
    });











});