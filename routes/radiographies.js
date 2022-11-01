const router = require('express').Router()
const radiographyController = require('../controllers/radiography_Controller')
const createError = require('http-errors')
const {upload} = require('../middleware/multer.middleware')
const {setImageName} = require('../utils/multerFunctions')
const {getUserFullName, getRadiography, getImagePath} = require('../utils/dbFunctions')
const {verifyToken} = require('../middleware/cookies.middleware')
const jwt = require('jsonwebtoken')
const path = require('path')
const fs = require('fs')
const {AIUrl} = require('../config')
const fetch = require('node-fetch')

const basePath = '/radiographies'

router.post('/scan', upload, async (req, res) => {
    const response = await fetch(AIUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            'id':"258"
        })
    })
    
    res.send(response)
})

router.post('/upload', verifyToken, (req, res, next) => {
    jwt.verify(req.token, process.env.ACCESS_TOKEN_SECRET, (err, payload) => {
        if(err) return res.send({error: createError.Unauthorized(err.message)})
        
        req.userId = payload.id
        upload(req, res, async err => {
            if(err) return next(createError.BadRequest(err.message))

            const fullImageName = setImageName(req.file)
            const imageRoute = `/public/images/${payload.id}/${fullImageName}`

            const radiographyInfo = {imageRoute, userId: payload.id, date: req.body['date'], injury: 'Hernia de disco'}

            const radiography = await radiographyController.create(radiographyInfo, next)

            if(radiography) res.send({
                radiographyId: radiography.id
            })
        })
    })
})

router.get('/all', verifyToken, (req, res, next) => {
    jwt.verify(req.token, process.env.ACCESS_TOKEN_SECRET, async (err, payload) => {
        if(err) return res.send({error: createError.Unauthorized(err.message)})
  
        const radiographies = await radiographyController.getAll(payload.id, next)
        
        if(radiographies) res.send({radiographies})
    })
})

router.get('/:id', async (req, res) => {
    const dirname = __dirname.substring(0, __dirname.length-7)
    const imagePath = await getImagePath(req.params.id)
    const filePath = dirname + path.join(imagePath)
    res.sendFile(filePath)
})

router.get('/:id/result', verifyToken, (req, res) => {
    jwt.verify(req.token, process.env.ACCESS_TOKEN_SECRET, async (err, payload) => {
        if(err) return res.send({error: createError.Unauthorized(err.message)})

        const radiography = await getRadiography(req.params.id)

        if(!radiography) return

        const result = {
            date: radiography.date,
            fullName: await getUserFullName(payload.id),
            injury: radiography.injury,
            precision: radiography.precision
        }

        res.send({result})
    })
})

router.delete('/:id', verifyToken, (req, res, next) => {
    jwt.verify(req.token, process.env.ACCESS_TOKEN_SECRET, async err => {
        if(err) return res.send({error: createError.Unauthorized(err.message)})

        const dirname = __dirname.substring(0, __dirname.length - 7)
        const imagePath = await getImagePath(req.params.id)
        fs.unlinkSync(dirname + path.join(imagePath), err => console.log(err))
        
        const isDeleted = await radiographyController.delete(req.params.id, next)

        if(isDeleted) res.send({isDeleted})
    })
})

module.exports = { router, basePath }