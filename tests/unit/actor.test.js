const Actor = require('../../lib/models/actor');
const {assert} = require('chai');
describe('Actor model', () => {
    it('validates with required fields', () =>{
        const actor = new Actor({
            name: 'Marilon Minroe',
            age: 36,
            living: false
        });
        return actor.validate();
    });
    it('fails validation when required fields are missing', () => {
        const actor = new Actor();
        
        return actor.validate()
            .then(
                () => { throw new Error('Expected validation error'); },
                ({ errors }) => {
                    //console.log('name errors => ',errors.name);
                    assert.ok(errors.name);
                    //console.log('color errors => ',errors.color);
                    assert.ok(errors.age);
                }
            );
    });

});