const Band = require('../../lib/models/band');
const {assert} = require('chai');

describe('Band model', () => {
    it('validates the required fields', () => {
        const band = new Band({
            name: 'Mindless Self Indulgence',
            genre: 'Industrial Punk',
            members: [{
                name: 'Jimmy Urine',
                role: 'Singer'
            }, {
                name: 'Lyn-Z',
                role: 'Bassist'
            }, {
                name: 'Steve, Righ?',
                role: 'Guitarist'
            }, {
                name: 'Kitty',
                role: 'Drummer'
            }]
        });
        return band.validate();
    });

    it('fails validation when required fields are missing', () => {
        const band = new Band();

        return band.validate()
            .then(
                () => {throw new Error('Expected validation error');},
                ({errors}) => {
                    assert.ok(errors.name);
                    assert.ok(errors.genre);
                }
            );
    });
});