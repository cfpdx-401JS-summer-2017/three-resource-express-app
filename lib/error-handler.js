function getErrorHandler(log = console.log){

    return function errorHandler(err, req, res, next) {
        if(err.name === 'ValidationError') {
            res.status(400).send(
                Object.values(err.errors).join(', '));
        } else {
            res.status(err.code || 500)
                .send(err.message || 'Internal Server Error');
        }
    };
}

module.exports = getErrorHandler;