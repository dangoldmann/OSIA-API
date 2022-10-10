const ApiError = require('./ApiError')

function apiErrorHandler(err, req, res, next){
    //console.log(err)

    if(err instanceof ApiError){
        res.status(err.code).json({
            error: {
                message: err.message
            }
        })
        return
    }

    res.status(500).json({
        error: {
            message: err.message
        }
    })
}

module.exports = apiErrorHandler