const db = require('./helpers/db');
const request = require('./helpers/request');
const assert = require('chai').assert;

describe('Contacts REST api', () => {

    beforeEach(db.drop);

    let token = null;
    before(() => db.getToken().then(t => token = t));

    function save(contact) {
        return request
            .post('/api/contacts')
            .set('Authorization', token)
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
                // contact = saved;
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
            .then(() => request
                .get('/api/contacts')
                .set('Authorization', token)
            )
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
            .then(contact => request
                .get(`/api/contacts/${contact._id}`)
                .set('Authorization', token)
            )
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
            .then(contact => request
                .delete(`/api/contacts/${contact._id}`)
                .set('Authorization', token)
            )
            .then(res => {
                assert.deepEqual(res.body, { removed: true });
            });
    });

    it('removes a contact by id and returns false', () => {
        return request.delete('/api/contacts/badec732c1f65718276bfadb')
            .set('Authorization', token)
            .then(res => res.body)
            .then(result => {
                assert.deepEqual(result, { removed: false });
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
            .then(contact => request
                .put(`/api/contacts/${contact._id}`).send(update)
                .set('Authorization', token)
            )
            .then(res => {
                assert.deepEqual(res.body.employer, update.employer);
            });
    });

});
