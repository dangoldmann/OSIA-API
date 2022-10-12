const router = require('express').Router()
const userController = require('../controllers/user_Controller')
const createError = require('http-errors')
const {signAccessToken, signRefreshToken, signResetPasswordToken, verifyRefreshToken, verifyResetPasswordToken} = require('../helpers/jwtHelper')
const {checkUserExistance, getUserId, getUserEmail} = require('../utils/dbFunctions')
const {sendResetPasswordEmail} = require('../helpers/emailSender')
const {signUpSchema} = require('../helpers/validators')
const {validator} = require('../middleware/validator.middleware')
const {isLoggedIn} = require('../middleware/cookies.middleware')
const {apiBaseUrl, cookieOptions} = require('../config')

const basePath = '/users'

router.get('/register', isLoggedIn, () => {})

router.post('/register', signUpSchema, validator, async (req, res, next) => {
    const {name, surname, email, phone, password} = req.body

    const userInfo = {name, surname, email, phone, password}
    
    const user = await userController.create(userInfo, next)
    
    if(user){
        const access_token = signAccessToken(user.id)

        res.cookie('access_token', access_token, cookieOptions)
        .status(201)
        .send({
            user,
            access_token
        })
    }
})

router.get('/all', async (req, res) => {
    if(req.get('origin') !== 'http://127.0.0.1:5500') return res.sendStatus(403) 
    
    const users = await userController.getAll()
    res.send({users})
})

router.post('/forgot-password', async (req, res, next) => {
    const {email} = req.body

    // Check the email to the cookie
    const isUser = await checkUserExistance('email', email)
    
    if(!isUser) return next(createError.BadRequest('No hay ninguna cuenta asociada con este mail'))

    const id = await getUserId('email', email)

    const token = signResetPasswordToken(id)
    const link = `${apiBaseUrl}/users/reset-password/${id}/${token}`
    
    sendResetPasswordEmail(email, link)

    res.send({message: 'Password reset link sent to your email'})
})

router.get('/reset-password/:id/:token', async (req, res, next) => {
    const {id, token} = req.params
    
    const isUser = await checkUserExistance('id', id)

    if(!isUser) return next(createError.BadRequest('Id not valid'))

    const payload = verifyResetPasswordToken(token, id)

    if(payload.message) {
        console.log(payload.message)
        return next(createError.Unauthorized(payload.message))
    }

    res.render('../views/reset-password')
})

router.post('/reset-password/:id/:token', async (req, res, next) => {
    const {id, token} = req.params
    const {password, password2} = req.body
    
    const isUser = await checkUserExistance('id', id)

    if(!isUser) return next(createError.BadRequest('Id not valid'))

    const payload = verifyResetPasswordToken(token, id)

    if(payload.message) {
        console.log(payload.message)
        return next(createError.Unauthorized(payload.message))
    }

    if(password !== password2) return next(createError.BadRequest('Passwords must match'))

    if(password.length < 6){
        //return next(createError.BadRequest('La contraseña debe de ser como mínimo de 6 caracteres'))
    }
    
    const email = await getUserEmail('id', id)
        
    const userInfo = {
        email,
        newPassword: password
    }

    const passwordReset = await userController.updatePassword(userInfo, next)

    if(passwordReset) return res.send({passwordReset})
})

router.delete('', async (req, res, next) => {
    const {email} = req.body
    
    if(!email) return next(createError.BadRequest('You must complete all the fields'))
    
    userInfo = {email}
    const isDeleted = await userController.delete(userInfo, next)
    
    if(isDeleted) res.send({isDeleted})
})

module.exports = {router, basePath}
