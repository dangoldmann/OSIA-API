const createError = require('http-errors')

const verifyToken = (req, res, next) => {
    const bearerHeader = req.headers['authorization']
    
    if(typeof bearerHeader !== 'undefined'){
        const bearerToken = bearerHeader.split(' ')[1]
        req.token = bearerToken
        
        return next()
    }
    return next({error: createError.Unauthorized('Token not found')})
}

module.exports = {verifyToken}