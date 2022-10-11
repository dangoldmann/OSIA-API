const createError = require('http-errors')
const jwt = require('jsonwebtoken')

const isLoggedIn = (req, res, next) => {
    const access_token = req.cookies.access_token

    try {
        jwt.verify(access_token, process.env.ACCESS_TOKEN_SECRET)
        return res.send({
            redirect: {
                destination: './HomePage.html',
                reason: 'You are already logged in'
            }
        })    
    } catch (error) {
        res.clearCookie('access_token', {sameSite: 'none', secure: true})
        return next()
    }
}

const cookieJwtAuth = (req, res, next) => {
    const access_token = req.cookies.access_token
    
    try {
        const userId = jwt.verify(access_token, process.env.ACCESS_TOKEN_SECRET).id
        req.userId = userId
        return next()
    }
    catch (err) {
        res.clearCookie('access_token', {sameSite: 'none', secure: true})
        
        return res.status(401).send({
            error: {
                status: 401,
                message: err.message
            },
            redirect: {
                destination: './LogIn.html',
                reason: 'You are not logged in'
            }
        })
    }
}

module.exports = {isLoggedIn, cookieJwtAuth}