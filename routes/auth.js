const router = require('express').Router()
const auth_Controller = require('../controllers/auth_Controller')
const {signAccessToken, signRefreshToken, verifyRefreshToken} = require('../helpers/jwtHelper')
const {isLoggedIn} = require('../middleware/cookies.middleware')
const {signUpSchema, logInSchema} = require('../helpers/validators')
const {validator} = require('../middleware/validator.middleware')
const {cookieOptions} = require('../config')
const createError = require('http-errors')

const basePath = '/auth'

router.get('/register', isLoggedIn, () => {})

router.get('/login', isLoggedIn, () => {})

router.get('/logout', (req, res) => {
    res.clearCookie('access_token', {sameSite: 'none', secure: true})
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

        res.cookie('access_token', access_token, cookieOptions)
        .status(201)
        .send({})
    }
})

router.post('/login', logInSchema, validator, async (req, res, next) => {
    const {email, password} = req.body

    const userInfo = {email, password}

    const user = await auth_Controller.login(userInfo, next)

    if(user) {
        const access_token = signAccessToken(user.id)
        const refresh_token = signRefreshToken(user.id)

        res.cookie('access_token', access_token, cookieOptions)
        .send({access_token, refresh_token})
    }
})

router.post('/refresh-token', (req, res, next) => {
    try {
        const {refreshToken} = req.body    
        if(!refreshToken) return next(createError.BadRequest('Token not found'))

        const payload = verifyRefreshToken(refreshToken)

        if(payload.message) {
            res.clearCookie('refresh_token', {sameSite: 'none', secure: true})
        
            return res.status(401).send({
                error: {
                    status: 401,
                    message: payload.message
                },
                redirect: {
                    destination: './LogIn.html'
                }
            })
        }

        const userId = payload.id

        const access_token = signAccessToken(userId)
        const refresh_token = signRefreshToken(userId)

        res.send({access_token, refresh_token})
    } catch (error) {
        return next(error)
    }
})

module.exports = {router, basePath}