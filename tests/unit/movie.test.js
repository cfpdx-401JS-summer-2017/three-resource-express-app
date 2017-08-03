const Movie = require('../../lib/models/movie');

const {assert} = require('chai');
describe('Movie model', () => {
    it('validates with required fields', () =>{
        const movie = new Movie({
            title: 'Star Wars',
            year: 1977,
            genre: 'Sci-Fi',
            cast: [
                'Harrison Ford',
                'Carrie Fisher',
                'Mark Hammil',
                'Yoda'
            ]
        });
        return movie.validate();
    });
    it('fails validation when required fields are missing', () => {
        const movie = new Movie();
        
        return movie.validate()
            .then(
                () => { throw new Error('Expected validation error'); },
                ({ errors }) => {
                    assert.ok(errors.title);
                    assert.ok(errors.year);
                }
            );
    });

});