const chai = require('chai');
const assert = chai.assert;
const chaiHttp = require('chai-http');
chai.use(chaiHttp);

process.env.MONGODB_URI = 'mongodb://localhost:27017/job-search-test';
require('../../lib/connect');

const connection = require('mongoose').connection;

const app = require('../../lib/app');
const request = chai.request(app);

describe('Company REST api', () => {

    beforeEach(() => connection.dropDatabase());

    function save(company) {
        return request.post('/companies')
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
            .then(() => request.get('/companies'))
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
            .then(company => request.get(`/companies/${company._id}`))
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
            .then(company => request.delete(`/companies/${company._id}`))
            .then(res => {
                assert.deepEqual(res.body, { removed: true });
            });
    });

    it('removes a company by id and returns false', () => {
        return request.delete('/companies/bade2ce0d3431d7cd30eb076')
            .then(res => {
                assert.deepEqual(res.body, { removed: false });
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
            .then(company => request.put(`/companies/${company._id}`).send(update))
            .then(res => {
                assert.deepEqual(res.body.location, update.location);
            });
    });
});
