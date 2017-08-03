const db = require('./helpers/db');
const request = require('./helpers/request');
const assert = require('chai').assert;

describe('Company REST api', () => {

    beforeEach(db.drop);

    let token = null;
    before(() => db.getToken().then(t => token = t));

    function save(company) {
        return request.post('/api/companies')
            .set('Authorization', token)
            .send(company)
            .then(({ body }) => {
                company._id = body._id;
                company.__v = body.__v;
                return body;
            });
    }

    it('saves a company', () => {
        let company = {
            name: 'Facebook, Inc.',
            url: 'www.facebook.com',
            location: {
                city: 'San Francisco',
                state: 'CA'
            }
        };

        return save(company)
            .then(saved => {
                assert.isOk(saved._id);
                assert.deepEqual(saved, company);
            });
    });

    it('gets all companies', () => {
        let companies = [
            {
                name: 'Airbnb',
                url: 'www.airbnb.com',
                location: {
                    city: 'San Francisco',
                    state: 'CA'
                }
            },{
                name: 'Janrain',
                url: 'www.janrain.com',
                location: {
                    city: 'Portland',
                    state: 'OR'
                }
            },{
                name: 'Squarespace',
                url: 'www.squarespace.com',
                location: {
                    city: 'New York City',
                    state: 'NY'
                }
            }
        ];

        return Promise.all(companies.map(save))
            .then(saved => companies = saved)
            .then(() => request
                .get('/api/companies')
                .set('Authorization', token)
            )
            .then(res => {
                const saved = res.body.sort((a, b) => a._id > b._id ? 1 : -1 );
                assert.deepEqual(saved, companies);
            });

    });
    
    it('gets a company by id', () => {
        let company = {
            name: 'Squarespace',
            url: 'www.squarespace.com',
            location: {
                city: 'New York City',
                state: 'NY'
            }
        };

        return save(company)
            .then(res => res.body = company)
            .then(company => request
                .get(`/api/companies/${company._id}`)
                .set('Authorization', token)
            )
            .then(res => {
                assert.deepEqual(res.body, company);
            });
    });
    
    it('removes a company by id', () => {
        let company = {
            name: 'Autodesk',
            url: 'www.autodesk.com',
            location: {
                city: 'Portland',
                state: 'OR'
            }
        };

        return save(company)
            .then(res => res.body = company)
            .then(company => request
                .delete(`/api/companies/${company._id}`)
                .set('Authorization', token)
            )
            .then(res => {
                assert.deepEqual(res.body, { removed: true });
            });
    });

    it('removes a company by id and returns false', () => {
        return request
            .delete('/api/companies/bade2ce0d3431d7cd30eb076')
            .set('Authorization', token)
            .then(res => res.body)
            .then(result => {
                assert.deepEqual(result, { removed: false });
            });
    });
    
    it('updates a company', () => {
        let company = {
            name: 'Puppet',
            url: 'www.puppet.com',
            location: {
                city: 'San Francisco',
                state: 'CA'
            }
        };

        let update = {
            location: {
                city: 'Portland',
                state: 'OR'
            }
        };

        return save(company)
            .then(res => res.body = company)
            .then(company => request
                .put(`/api/companies/${company._id}`)
                .set('Authorization', token)
                .send(update)
            )
            .then(res => {
                assert.deepEqual(res.body.location, update.location);
            });
    });
});
