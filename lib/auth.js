const TOKEN = 'sekrit';

module.exports = function createAuth() {
    return function auth(req, res, next) {
        const token = req.get('Authorization');
        if(!token) {
            return next({ code: 401, message: 'No token found' });
        }
        if(token !== TOKEN) {
            return next({ code: 401, message: 'Invalid token' });
        }
        
        next();
    };
};