const express = require('express');
const router = express.Router();
const Contact = require('../models/contact');

router
    .get('/', (req, res, next) => {
        Contact.find()
            .then(contacts => res.send(contacts))
            .catch(next);
    })
    
    .get('/:id', (req, res, next) => {
        Contact.findById(req.params.id)
            .lean()
            .then(contact => {
                if(!contact) res.status(404).send(`Cannot GET contact with ID:${req.params.id}`);
                else res.send(contact);
            })
            .catch(next);
    })

    .post('/', (req, res, next) => {
        const contact = new Contact(req.body);
        contact
            .save()
            .then(contact => res.send(contact))
            .catch(next);
    })

    .put('/:id', (req, res, next) => {
        Contact.findByIdAndUpdate(req.params.id, req.body, { new: true })
            .lean()
            .then(contact => res.send(contact))
            .catch(next);
    })

    .delete('/:id', (req, res) => {
        Contact.findByIdAndRemove(req.params.id)
            .then(response => res.send({ removed: !!response }));
    });

module.exports = router;
