const { clearHash } = require('../services/cache');

module.exports = async (req, res, next) => {
    await next();
    if(req.user && req.user.id){
        clearHash(req.user.id)
    }
    
}