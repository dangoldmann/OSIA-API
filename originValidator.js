const originValidator = (req, res, next) => {
    if(req.get('origin') === 'http://127.0.0.1:5500'){
        return next()
    }
    res.sendStatus(403)
}

module.exports = {originValidator}