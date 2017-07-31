const chai = require('chai');
const assert = chai.assert;
const chaiHttp = require('chai-http');
chai.use(chaiHttp);

process.env.MONGODB_URI = 'mongodb://localhost:27017/job-search-test';
require('../../lib/connect');

const connection = require('mongoose').connection;

const app = require('../../lib/app');
const request = chai.request(app);

describe('Contacts REST api', () => {

    beforeEach(() => connection.dropDatabase());

    function save(contact) {
        return request.post('/contacts')
            .send(contact)
            .then(({ body }) => {
                contact._id = body._id;
                contact.__v = body.__v;
                return body;
            });
    }

    it('saves a contact', () => {
        let contact = {
            name: 'Joel Gunz',
            employer: 'Nike',
            connected: 'Email'
        };

        return save(contact)
            .then(saved => {
                assert.isOk(saved._id);
                assert.deepEqual(saved, contact);
            });

    });
    
    it('gets all contacts', () => {
        let contacts = [
            {
                name: 'Mo',
                employer: 'The Three Stooges',
                connected: 'Meetup'
            },{
                name: 'Larry',
                employer: 'The Three Stooges',
                connected: 'Email'
            },{
                name: 'Curly',
                employer: 'The Three Stooges',
                connected: 'Mutual Acquaintance'
            }
        ];

        return Promise.all(contacts.map(save))
            .then(saved => contacts = saved)
            .then(() => request.get('/contacts'))
            .then(res => {
                const saved = res.body.sort((a, b) => a._id > b._id ? 1 : -1 );
                assert.deepEqual(saved, contacts);
            });

    });
    
    it('gets a contact by id', () => {
        let contact = {
            name: 'Phil',
            employer: 'Autodesk',
            connected: 'Meetup'
        };

        return save(contact)
            .then(res => res.body = contact)
            .then(contact => request.get(`/contacts/${contact._id}`))
            .then(res => {
                assert.deepEqual(res.body, contact);
            });
    });
    
    it('removes a contact by id', () => {
        let contact = {
            name: 'Jim',
            employer: 'Google',
            connected: 'Email'
        };

        return save(contact)
            .then(res => res.body = contact)
            .then(contact => request.delete(`/contacts/${contact._id}`))
            .then(res => {
                assert.deepEqual(res.body, { removed: true });
            });
    });

    it('removes a contact by id and returns false', () => {
        return request.delete('/contacts/badec732c1f65718276bfadb')
            .then(res => {
                assert.deepEqual(res.body, { removed: false });
            });
    });
    
    it('updates a contact', () => {
        let contact = {
            name: 'Vern',
            employer: 'Google',
            connected: 'Mutual Acquaintance'
        };

        let update = { employer: 'Puppet' };

        return save(contact)
            .then(res => res.body = contact)
            .then(contact => request.put(`/contacts/${contact._id}`).send(update))
            .then(res => {
                assert.deepEqual(res.body.employer, update.employer);
            });
    });

});