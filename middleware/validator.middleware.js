const {validationResult} = require('express-validator')
const ApiError = require('../classes/ApiError')

const validator = (req, res, next) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()) {
        next(ApiError.badRequest(errors.array()))
    }
    next()
}

module.exports = {validator}