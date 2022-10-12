const router = require('express').Router()
const authController = require('../controllers/auth_Controller')
const {signAccessToken} = require('../helpers/jwtHelper')
const {isLoggedIn} = require('../middleware/cookies.middleware')
const {logInSchema} = require('../helpers/validators')
const {validator} = require('../middleware/validator.middleware')
const {cookieOptions} = require('../config')

const basePath = '/auth'

router.get('/login', isLoggedIn, () => {})

router.get('/logout', (req, res) => {
    res.clearCookie('access_token', {sameSite: 'none', secure: true})
    .send({
        redirect: {
            destination: './LogIn.html'
        } 
    })
})

router.post('/login', logInSchema, validator, async (req, res, next) => {
    const {email, password} = req.body

    const userInfo = {email, password}

    const user = await authController.login(userInfo, next)

    if(user) {
        const access_token = signAccessToken(user.id)

        res.cookie('access_token', access_token, cookieOptions)
        .send()
    }
})

router.post('/refresh-token', (req, res, next) => {
    
})

module.exports = {router, basePath}