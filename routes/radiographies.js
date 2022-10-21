const router = require('express').Router()
const radiographyController = require('../controllers/radiography_Controller')
const createError = require('http-errors')
const {upload} = require('../middleware/multer.middleware')
const {cookieJwtAuth} = require('../middleware/cookies.middleware')
const {setImageName} = require('../utils/multerFunctions')

const basePath = '/radiographies'

router.post('/upload', cookieJwtAuth, async (req, res, next) => {
    upload(req, res, async err => {
        if(err) return next(createError.BadRequest(err.message))
        
        const fullImageName = setImageName(req.file)
        const imageRoute = `./public/images/${req.userId}/${fullImageName}`
        
        const radiographyInfo = {imageRoute, userId: req.userId}

        const radiography = await radiographyController.create(radiographyInfo, next)

        if(radiography) res.status(201).send({})

        // ESCANEAR CON IA Y DEVOLVER RESULTADO
    })
})

router.get('', async (req, res, next) => {
    const {userId} = req.body
    
    if(!userId) return next(createError.BadRequest('You must complete all the fields'))
    
    const userInfo = {userId}

    const imageRoutes = await radiographyController.getByUserId(userInfo, next)

    if(imageRoutes) res.send({imageRoutes})
})

router.delete('/delete', async (req, res, next) => {
    const {imageRoute} = req.body

    if(!imageRoute) return next(createError.BadRequest('You must complete all the fields'))

    const radiographyInfo = {imageRoute}

    const isDeleted = await radiographyController.delete(radiographyInfo, next)

    if(isDeleted) res.send({isDeleted})
})

module.exports = { router, basePath }