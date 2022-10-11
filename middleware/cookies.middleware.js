const {verifyAccessToken} = require('../helpers/jwtHelper')

const isLoggedIn = (req, res, next) => {
    const access_token = req.cookies.access_token

    const payload = verifyAccessToken(access_token)
    
    if(payload.message) {
        res.clearCookie('access_token', {sameSite: 'none', secure: true})
        return next()
    }

    return res.send({
        redirect: {
            destination: './HomePage.html',
            reason: 'You are already logged in'
        }
    })
}

const cookieJwtAuth = (req, res, next) => {
    const access_token = req.cookies.access_token
    
    const payload = verifyAccessToken(access_token)
    
    if(payload.message) {
        res.clearCookie('access_token', {sameSite: 'none', secure: true})
        
        return res.status(401).send({
            error: {
                status: 401,
                message: payload.message
            },
            redirect: {
                destination: './LogIn.html',
                reason: 'You are not logged in'
            }
        })
    }
    
    const userId = payload.id
    req.userId = userId
    return next()
}

module.exports = {isLoggedIn, cookieJwtAuth}