const router = require('express').Router()
const jwt = require('jsonwebtoken')

const basePath = '/test'

const user = {
    id: 1,
    email: 'goldmandan8@gmail.com',
    password: 'contraseña'
}

const JWT_SECRET = process.env.SECRET_KEY

router.post('/forgot-password', (req, res, next) => {
    const {email} = req.body 

    if(email !== user.email){
        res.status(400).send('User not registered')
        return
    }

    const secret = JWT_SECRET + user.password

    const payload = {
        email: user.email,
        id: user.id
    }

    const token = jwt.sign(payload, secret, {expiresIn: '15m'})
    const link = `http://localhost:3000/test/reset_password/${user.id}/${token}`
    
    console.log(link)

    res.send('Password reset link sent to your email')

})

router.get('/reset-password/:id/:token', (req, res, next) => {
    const {id, token} = req.params
    
    // Chek if the ID exists
    if(id != user.id){
        
    }

    const secret = JWT_SECRET + user.password
    try {
        const payload = jwt.verify(token, secret)

        user.password = password
        res.send(user)
    } catch (error) {
        console.log(error.message)
        res.send(error.message)
    }
})

router.post('/reset-password/:id/:token', (req, res, next) => {
    const {id, token} = req.params
    const {password, password2} = req.body

    console.log(id)
    // Check if user exists
    if(id !== user.id){
        res.send('Invalid id')
        return
    }
    console.log('ok')
    const secret = JWT_SECRET + user.password

    try {
        const payload = jwt.verify(token, secret)
        // validate passwords 1 and 2
        user.password = password
        res.send(user)
    } catch (error) {
        console.log(error.message)
        res.send(error.message)
    }
})

module.exports = {basePath, router}