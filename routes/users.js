const router = require('express').Router()
const userController = require('../controllers/user_Controller')
const ApiError = require('../error/ApiError')
const jwt = require('jsonwebtoken')
const {body, validationResult, check} = require('express-validator')
const {checkUserExistance, getUserId, getUserEmail} = require('../scripts/dbFunctions')
const {sendResetPasswordEmail} = require('../controllers/email_Controller')

const basePath = '/users'

//const apiBaseUrl = 'http://localhost:3000'
const apiBaseUrl = 'https://osia-api-production.up.railway.app'

router.post('/register', [
    body('name', 'Ingrese un nombre completo').isLength({min: 3}),
    body('surname', 'Ingrese un apellido completo').isLength({min: 4}),
    body('email', 'Ingrese un email valido').isEmail(),
    body('phone', 'Ingres un número de telefono válido').isMobilePhone(),
    //body('password', 'La contraseña debe de ser como mínimo de 6 caracteres').isLength({min: 6})
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
            sameSite: 'none',
            secure: true
        })
        .status(201)
        .send({
            user,
            token
        })
    }
})

router.post('/login', [
    body('email', 'Ingrese un email valido').isEmail(),
    //body('password', 'La contraseña debe de ser como mínimo de 6 caracteres').isLength({min: 6})
], async (req, res, next) => {
    const errors = validationResult(req)

    if(!errors.isEmpty()){
        next(ApiError.badRequest(errors.array()))
        return
    }
    
    const {email, password} = req.body

    const userInfo = {email, password}

    const user = await userController.login(userInfo, next)

    if(user) {
        const token = jwt.sign({user}, process.env.SECRET_KEY, {expiresIn: '24h'})

        res.cookie('token', token, {
            httpOnly: true,
            maxAge: 86400,
            sameSite: 'none',
            secure: true
        })
        .send({
            user,
            token        
        })
    }
})

router.get('/all', async (req, res) => {
    const users = await userController.getAll()
    res.send({body: {users}})
})

router.post('/forgot-password', async (req, res, next) => {
    const {email} = req.body

    // Check the email to the cookie
    const isUser = await checkUserExistance('email', email)
    
    if(!isUser){
        next(ApiError.badRequest('No hay ninguna cuenta asociada con este mail'))
        return
    }

    const id = await getUserId('email', email)

    const secret = process.env.SECRET_KEY + id
    
    const payload = {
        id,
        email
    }

    const token = jwt.sign(payload, secret, {expiresIn: '3h'})
    const link = `${apiBaseUrl}/users/reset-password/${id}/${token}`
    
    sendResetPasswordEmail(email, link)

    res.send({message: 'Password reset link sent to your email'})
})

router.get('/reset-password/:id/:token', async (req, res, next) => {
    const {id, token} = req.params
    
    const isUser = await checkUserExistance('id', id)

    if(!isUser){
        next(ApiError.badRequest('Id not valid'))
        return
    }

    const secret = process.env.SECRET_KEY + id

    try {
        const payload = jwt.verify(token, secret)
        res.render('../views/reset-password')
    } catch (error) {
        console.log(error.message)
        res.send(error.message)
    }
})

router.post('/reset-password/:id/:token', async (req, res, next) => {
    const {id, token} = req.params
    const {password, password2} = req.body
    
    const isUser = await checkUserExistance('id', id)

    if(!isUser){
        next(ApiError.badRequest('Id not valid'))
        return
    }

    const secret = process.env.SECRET_KEY + id

    try {
        const payload = jwt.verify(token, secret)
        
        if(password !== password2){
            next(ApiError.badRequest('Passwords must match'))
            return
        }

        if(password.length < 6){
            //next(ApiError.badRequest('La contraseña debe de ser como mínimo de 6 caracteres'))
            //return
        }
        
        const email = await getUserEmail('id', id)
        
        const userInfo = {
            email,
            newPassword: password
        }

        const passwordReset = await userController.updatePassword(userInfo, next)

        if(passwordReset){
            res.send({passwordReset})
        }
    } catch (error) {
        console.log(error.message)
        res.send(error.message)
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
        res.send({isDeleted})
    }
})

module.exports = {router, basePath}
