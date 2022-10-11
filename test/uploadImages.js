const router = require('express').Router()
const createError = require('http-errors')
const {upload} = require('../middleware/multer.middleware')

const basePath = '/images'

router.post('/upload', (req, res, next) => {
    upload(req, res, err => {
        if(err) return next(createError.BadRequest(err.message))

        const image = req.file

        const message = image ? 'Image uploaded successfully' : 'There was a problem'

        res.send({message})
    })
    
})

module.exports = {router, basePath}

