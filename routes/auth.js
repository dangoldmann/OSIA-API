const router = require('express').Router()
const auth_Controller = require('../controllers/auth_Controller')
const {signAccessToken, signRefreshToken, verifyRefreshToken} = require('../helpers/jwtHelper')
const {signUpSchema, logInSchema} = require('../helpers/validators')
const {validator} = require('../middleware/validator.middleware')
const {refreshTokenCookieOptions} = require('../config')
const { verifyToken } = require('../middleware/cookies.middleware')
const createError = require('http-errors')
const jwt = require('jsonwebtoken')

const basePath = '/auth'

router.get('/logout', (req, res) => {
    res
    .clearCookie('refresh_token', {sameSite: 'none', secure: true})
    .send({
        redirect: {
            destination: './LogIn.html'
        } 
    })
})

router.post('/register', signUpSchema, validator, async (req, res, next) => {
    const {name, surname, email, phone, password} = req.body

    const userInfo = {name, surname, email, phone, password}
    
    const user = await auth_Controller.register(userInfo, next)
    
    if(user){
        const access_token = signAccessToken(user.id)
        const refresh_token = signRefreshToken(user.id)
        
        res
        .cookie('refresh_token', refresh_token, refreshTokenCookieOptions)
        .status(201)
        .send({access_token})
    }
})

router.post('/login', logInSchema, validator, async (req, res, next) => {
    const {email, password} = req.body
    
    const userInfo = {email, password}

    const user = await auth_Controller.login(userInfo, next)

    if(user) {
        const access_token = signAccessToken(user.id)
        const refresh_token = signRefreshToken(user.id)
        res
        .cookie('refresh_token', refresh_token, refreshTokenCookieOptions)
        .send({access_token})
    }
})

router.post('/isLoggedIn', verifyToken, (req, res, next) => {
    jwt.verify(req.token, process.env.ACCESS_TOKEN_SECRET, err => {
        if(!err) return res.send({
            redirect: {
                destination: './HomePage.html'
            }
        })
        return res.send({})
    })
})

router.post('/isNotLoggedIn', verifyToken, (req, res) => {
    jwt.verify(req.token, process.env.ACCESS_TOKEN_SECRET, err => {
        if(err) return res.send({
            error: createError.Unauthorized(err.message),
            redirect: {
                destination: './LogIn.html'
            }
        })
        res.send({})
    })
})

router.post('/refresh-token', (req, res) => {
    const refreshToken = req.cookies.refresh_token  
        
    const payload = verifyRefreshToken(refreshToken)

    if(payload.message) {
        res.clearCookie('refresh_token', {sameSite: 'none', secure: true})
    
        return res.send({
            error: {
                message: payload.message
            },
            redirect: {
                destination: './LogIn.html'
            }
        })
    }
    
    const access_token = signAccessToken(payload.id)
    const refresh_token = signRefreshToken(payload.id)

    res
    .cookie('refresh_token', refresh_token, refreshTokenCookieOptions)
    .send({access_token})
    
})

module.exports = {router, basePath}