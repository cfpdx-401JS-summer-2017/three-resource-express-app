const mongoose = require('mongoose');
mongoose.Promise = Promise;

const url = process.env.MONGODB_URL || 'mongodb://localhost:27017/arboretum';

mongoose.connect(url);

mongoose.connection.on('connected', () => console.log('Mongoose default connection open on', url));

mongoose.connection.on('error', () => console.log('Mongoose default connection error'));

mongoose.connection.on('disconnected', () => console.log('Mongoose default connection disconnected'));

process.on('SIGINT', () => {
    mongoose.connection.close(() => {
        console.log('Mongoose default connection disconnected through app termination');
        process.exit(0);
    });
});