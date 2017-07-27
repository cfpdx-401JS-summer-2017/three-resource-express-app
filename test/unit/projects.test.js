const Project = require('../../lib/models/project');

const { assert } = require('chai');

describe('Project model', () => {
    
    it('validates with required fields', () => {
        const demo = new Project({
            name: 'KESdemo',
            projectNo: 20170301,
            equipment: [
                'dozer',
                '400 excavator',
                '300 excavator'
            ],
            employees: ['Bob', 'Dave', 'Stan' ],
            endDate: 'Feb. 24, 2018',
            contractPrice: '$160,000'
        });

        return demo.validate();
    });

    it('fails validation when required fields are missing', () => {
        const road = new Project ();

        return road.validate()
            .then(
                () => { throw new Error('Expected Validation Error'); },
                ({ errors }) => {
                    assert.ok(errors.name);
                    assert.ok(errors.projectNo);
                    assert.ok(errors.endDate);
                    assert.ok(errors.contractPrice);
                }
            );
    });
});