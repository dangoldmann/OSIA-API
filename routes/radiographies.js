const router = require('express').Router()
const radiographyController = require('../controllers/radiography_Controller')
const createError = require('http-errors')
const {upload} = require('../middleware/multer.middleware')
const {getUserFullName, getRadiography, getImagePath} = require('../utils/dbFunctions')
const {verifyToken} = require('../middleware/cookies.middleware')
const jwt = require('jsonwebtoken')
const path = require('path')
const fs = require('fs')
const {predictAI} = require('../helpers/ai')
const cloudinary = require('../helpers/cloudinary')

const basePath = '/radiographies'
const dirname = __dirname.substring(0, __dirname.length - 7)

router.get('/all', verifyToken, (req, res, next) => {
    jwt.verify(req.token, process.env.ACCESS_TOKEN_SECRET, async (err, payload) => {
        if(err) return res.send({error: createError.Unauthorized(err.message)})
  
        const radiographies = await radiographyController.getAll(payload.id, next)
        
        if(radiographies) res.send({radiographies})
    })
})

router.get('/:id/result', verifyToken, (req, res) => {
    jwt.verify(req.token, process.env.ACCESS_TOKEN_SECRET, async (err, payload) => {
        if(err) return res.send({error: createError.Unauthorized(err.message)})

        const radiography = await getRadiography(req.params.id)

        if(!radiography) return

        const result = {
            imageRoute: radiography.image_route,
            date: radiography.date,
            fullName: await getUserFullName(payload.id)
        }

        res.send({result})
    })
})

router.post('/upload', verifyToken, (req, res, next) => {
    jwt.verify(req.token, process.env.ACCESS_TOKEN_SECRET, async (err, payload) => {
        if(err) return res.send({error: createError.Unauthorized(err.message)})

        upload(req, res, async err => {
            if(err) return next(createError.BadRequest(err.message))
            
            const uploadToCloudinary = async path => cloudinary.upload(path, `images/${payload.id}`)

            const imagePath = req.file.path
            let data = await uploadToCloudinary(imagePath)
            if(!data.url) return next(createError.BadRequest('Could not upload image due to connection error'))
            let urls = data.url.split('/')
            const imageRoute = `/${urls[6]}/images/${payload.id}/${urls[9]}`

            const radiographyInfo = {imageRoute, userId: payload.id, date: req.body['date']}

            const radiography = await radiographyController.create(radiographyInfo, next)

            try {
                const aiPrediction = await predictAI(imageRoute)
            
                const buffer = Buffer.from(aiPrediction, 'base64')
                fs.writeFileSync(dirname + path.join(`/public/images/${req.file.filename}`), buffer)

                data = await uploadToCloudinary(imagePath)
                urls = data.url.split('/')
                const newImageRoute = `/${urls[6]}/images/${payload.id}/${urls[9]}`
                radiographyController.updateImageRoute(radiography.id, newImageRoute)

                fs.unlinkSync(imagePath)
            } catch (error) {
                console.log(error.message)
            }

            if(radiography) res.send({
                radiographyId: radiography.id
            })
        })
    })
})

router.delete('/:id', verifyToken, (req, res, next) => {
    jwt.verify(req.token, process.env.ACCESS_TOKEN_SECRET, async (err, payload) => {
        if(err) return res.send({error: createError.Unauthorized(err.message)})

        const deleteImage = async fileName => cloudinary.delete(fileName)

        const imagePath = await getImagePath(req.params.id)
        
        const pathParts = imagePath.split('/')
        const fileName = pathParts[pathParts.length - 1].split('.')[0]
        const cloudinaryPath = `images/${payload.id}/${fileName}`
       
        const result = await deleteImage(cloudinaryPath)
       
        const isDeleted = await radiographyController.delete(req.params.id, next)

        if(isDeleted) res.send({
            deletedFromDb: isDeleted,
            deletedFromCloudinary: result.result == 'ok'
        })
    })
})

module.exports = { router, basePath }