const router = require('express').Router()

const {upload} = require('../middleware/multer.middleware')

const basePath = '/images'

router.post('/upload', upload, (req, res) => {
    const image = req.file
    console.log(image)

    const message = image ? 'Image uploaded successfully' : 'There was a problem'

    res.send({message})
})

module.exports = {router, basePath}

