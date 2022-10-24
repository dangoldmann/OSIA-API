const router = require('express').Router()
const radiographyController = require('../controllers/radiography_Controller')
const createError = require('http-errors')
const {upload} = require('../middleware/multer.middleware')
const {setImageName} = require('../utils/multerFunctions')
const {verifyToken} = require('../middleware/cookies.middleware')
const jwt = require('jsonwebtoken')

const basePath = '/radiographies'

router.post('/upload', verifyToken, async (req, res, next) => {
    jwt.verify(req.token, process.env.ACCESS_TOKEN_SECRET, (err, payload) => {
        if(err) return res.send({error: createError.Unauthorized(err.message)})

        req.userId = payload.id
        upload(req, res, async err => {
            if(err) return next(createError.BadRequest(err.message))
            
            const fullImageName = setImageName(req.file)
            const imageRoute = `./public/images/${payload.id}/${fullImageName}`
            
            //const injury = scanAI(req.file) // SCAN AI
    
            const radiographyInfo = {imageRoute, userId: payload.id, date: req.body.date, injury: 'Hernia de disco'}
    
            const radiography = await radiographyController.create(radiographyInfo, next)
            
            if(radiography) res.send({
                redirect: {
                    destination: './ResultadosImagen.html'
                }
            })
        })
    })
})

router.get('/all', verifyToken, async (req, res, next) => {
    
    jwt.verify(req.token, process.env.ACCESS_TOKEN_SECRET, async (err, payload) => {
        if(err) return res.send({error: createError.Unauthorized(err.message)})

        const radiographies = await radiographyController.getAll(payload.id, next)

        if(radiographies) res.send({radiographies})
    })     
})   

router.get('', async (req, res, next) => {
    const {userId} = req.body
    
    if(!userId) return next({error: createError.BadRequest('You must complete all the fields')})
    
    const userInfo = {userId}

    const imageRoutes = await radiographyController.getByUserId(userInfo, next)

    if(imageRoutes) res.send({imageRoutes})
})

router.delete('/delete', async (req, res, next) => {
    const {imageRoute} = req.body

    if(!imageRoute) return next({error: createError.BadRequest('You must complete all the fields')})

    const radiographyInfo = {imageRoute}

    const isDeleted = await radiographyController.delete(radiographyInfo, next)

    if(isDeleted) res.send({isDeleted})
})

module.exports = { router, basePath }