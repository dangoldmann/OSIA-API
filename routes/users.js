const router = require('express').Router()
const userController = require('../controllers/user_Controller')
const createError = require('http-errors')
const {signResetPasswordToken, verifyResetPasswordToken, verifyRefreshToken} = require('../helpers/jwtHelper')
const {checkUserExistance, getUserId, getUserEmail} = require('../utils/dbFunctions')
const {sendResetPasswordEmail} = require('../helpers/emailSender')
const {apiBaseUrl} = require('../config')
const {verifyToken} = require('../middleware/cookies.middleware')
const jwt = require('jsonwebtoken')
const { create } = require('../service/radiography_Service')

const basePath = '/users'

router.get('/all', async (req, res) => {
    const users = await userController.getAll()
    res.send({users})
})

router.get('/full-name', verifyToken, async (req, res) => {
    jwt.verify(req.token, process.env.ACCESS_TOKEN_SECRET, async (err, payload) => {
        if(err) return res.send({error: createError.Unauthorized(err.message)})

        const fullName = await userController.getFullName(payload.id)
        res.send({fullName})
    })
})

router.get('/info', verifyToken, async (req, res, next) => {
    jwt.verify(req.token, process.env.ACCESS_TOKEN_SECRET, async (err, payload) => {
        if(err) return res.send({error: createError.Unauthorized(err.message)})

        const userInfo = await userController.getUserInfo(payload.id, next)
        res.send({userInfo})
    })
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
