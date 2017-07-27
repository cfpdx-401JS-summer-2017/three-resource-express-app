const Album = require('../../lib/models/album');
const {assert} = require('chai');

describe('Album model', () => {
    it('validates the required fields', () => {
        const album = new Album({
            name: 'Offcell',
            genre: 'Indie Pop',
            year: 2003,
            tracks: 5
        });
        return album.validate();
    });

    it('fails validation when required fields are missing', () => {
        const album = new Album();

        return album.validate()
            .then(
                () => {throw new Error('Expected validation error');},
                ({errors}) => {
                    assert.ok(errors.name);
                    assert.ok(errors.genre);
                    assert.ok(errors.year);
                    assert.ok(errors.tracks);
                }
            );
    });
});