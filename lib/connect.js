const mongoose = require('mongoose');
mongoose.Promise = Promise;

const dbUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/tacos';

mongoose.connect(dbUri);

mongoose.connection.on('connected', () => {
    console.log('mongoose default connection open to ' + dbUri);//eslint-disable-line
});

mongoose.connection.on('error', err => {
    console.log('mongoose default connection error:' + err);//eslint-disable-line
});

mongoose.connection.on('disconnected', () => {
    console.log('mongoose default connection disconnected');//eslint-disable-line
});

process.on('SIGINT', () => {
    mongoose.connection.close(() => {
        console.log('mongoose default connection disconnected through app termination');//eslint-disable-line
        process.exit(0);
    });
});