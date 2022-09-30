const router = require('express').Router()
const userController = require('../controllers/user_Controller')
const ApiError = require('../error/ApiError')
const jwt = require('jsonwebtoken')
const {body, validationResult} = require('express-validator')

const basePath = '/users'

router.post('/register', [
    body('name', 'Ingrese un nombre completo').isLength({min: 3}),
    body('surname', 'Ingrese un apellido completo').isLength({min: 4}),
    body('email', 'Ingrese un email valido').isEmail(),
    body('phone', 'Ingres un número de telefono válido').isMobilePhone(),
    body('password', 'La contraseña debe de ser como mínimo de 6 caracteres').isLength({min: 6})
],  async (req, res, next) => {
    const errors = validationResult(req)
    
    if(!errors.isEmpty()){
        next(ApiError.badRequest(errors.array()))
        return
    }
    
    const {name, surname, email, phone, password} = req.body

    const userInfo = {name, surname, email, phone, password}
    
    const user = await userController.create(userInfo, next)
    
    if(user){
        const token = jwt.sign({user}, process.env.SECRET_KEY, {expiresIn: '24h'})

        res.cookie('token', token, {
            httpOnly: true,
            maxAge: 86400,
            withCredentials: true,
            sameSite: 'none',
            secure: true
        })
        .status(201)
        .send({
            body: {
                user,
                token
            }
        })
    }
})

router.post('/login', async (req, res, next) => {
    const {email, password} = req.body
    
    if(!email || !password){
        next(ApiError.badRequest('You must complete all the fields'))
        return
    }

    const userInfo = {email, password}

    const user = await userController.login(userInfo, next)

    if(user) {
        const token = jwt.sign({user}, process.env.SECRET_KEY, {expiresIn: '24h'})

        res.cookie('token', token, {
            httpOnly: true,
            maxAge: 86400,
            withCredentials: true,
            sameSite: 'none',
            secure: true
        })
        .send({
            body: {
                user,
                token
            }
        })
    }
})

router.get('/all', async (req, res) => {
    const users = await userController.getAll()
    res.send({body: {users}})
})

router.put('/password-reset', async (req, res, next) => {
    const {email, newPassword} = req.body
    
    if(!email || !newPassword){
        next(ApiError.badRequest('You must complete all the fields'))
        return
    }

    userInfo = {email, newPassword}
    const passwordReset = await userController.updatePassword(userInfo, next)
    
    if(passwordReset)
    {
        res.send({body: {passwordReset}})
    }
})

router.delete('', async (req, res, next) => {
    const {email} = req.body
    
    if(!email){
        next(ApiError.badRequest('You must complete all the fields'))
        return
    }
    
    userInfo = {email}
    const isDeleted = await userController.delete(userInfo, next)
    
    if(isDeleted)
    {
        res.send({body: {isDeleted}})
    }
})

module.exports = {router, basePath}
