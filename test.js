const router = require('express').Router()
const jwt = require('jsonwebtoken')
const {cookieJwtAuth} = require('./cookieJwtAuth')

const basePath = '/test'

router.get('', (req, res) => {
    const user = {
        id: 1,
        name: 'name'
    }

    const token = jwt.sign({user}, process.env.SECRET_KEY, {expiresIn: '24h'})

    res.setHeader('Set-Cookie', [`token=${token}; max-age=86400; HttpOnly`])
    
    res.redirect('/test/home')
})

router.get('/home', cookieJwtAuth, (req, res) => {
    res.send('You are in the Home Page')
})

module.exports = {basePath, router}