const {validationResult} = require('express-validator')
const createError = require('http-errors')

const validator = (req, res, next) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()) next(createError.BadRequest(errors.array()))
    
    next()
}

module.exports = {validator}