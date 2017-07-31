const express = require('express');
const router = express.Router();
const jsonParser = require('body-parser').json();
const Contact = require('../models/contact');

router
    .get('/', jsonParser, (req, res, next) => {
        Contact.find()
            .then(contacts => res.send(contacts))
            .catch(next);
    })
    
    .get('/:id', jsonParser, (req, res, next) => {
        Contact.findById(req.params.id)
            .lean()
            .then(contact => {
                if(!contact) res.status(404).send(`Cannot GET contact with ID:${req.params.id}`);
                else res.send(contact);
            })
            .catch(next);
    })

    .post('/', jsonParser, (req, res, next) => {
        const contact = new Contact(req.body);
        contact
            .save()
            .then(contact => res.send(contact))
            .catch(next);
    })

    .delete('/:id', jsonParser, (req, res, next) => {
        Contact.findByIdAndRemove(req.params.id)
            .then(contact => (contact === null) ? res.send({ removed: false }) : res.send({ removed: true }))
            .catch(next);
    })

    .put('/:id', jsonParser, (req, res, next) => {
        Contact.findByIdAndUpdate(req.params.id, req.body, { new: true })
            .lean()
            .then(contact => res.send(contact))
            .catch(next);
    })

    .use(jsonParser);

module.exports = router;
