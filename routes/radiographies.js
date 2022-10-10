const router = require('express').Router()
const radiographyController = require('../controllers/radiography_Controller')
const jwt = require('jsonwebtoken')
const ApiError = require('../classes/ApiError')
const {upload} = require('../middleware/multer.middleware')

const basePath = '/radiographies'

router.post('/upload', async (req, res, next) => {
    upload(req, res, err => {
        if(err) next(ApiError.badRequest(err.message))
    })

    const access_token = req.cookies.access_token
    const user = jwt.verify(access_token, process.env.SECRET_KEY).user

    const imageRoute = `./public/images/${user.id}`

    const radiographyInfo = {imageRoute, bodyPart: 'Brazo', userId: user.id}

    const radiography = await radiographyController.create(radiographyInfo, next)

    if(radiography) res.status(201).send({radiography})
})

router.get('', async (req, res, next) => {
    const {userId} = req.body
    
    if(!userId){
        next(ApiError.badRequest('You must complete all the fields'))
        return
    }
    
    const userInfo = {userId}

    const imageRoutes = await radiographyController.getByUserId(userInfo, next)

    if(imageRoutes){
        res.send({imageRoutes})
    }
})

router.delete('/delete', async (req, res, next) => {
    const {imageRoute} = req.body

    if(!imageRoute){
        next(ApiError.badRequest('You must complete all the fields'))
        return
    }

    const radiographyInfo = {imageRoute}

    const isDeleted = await radiographyController.delete(radiographyInfo, next)

    if(isDeleted){
        res.send({isDeleted})
    }
})

module.exports = { router, basePath }