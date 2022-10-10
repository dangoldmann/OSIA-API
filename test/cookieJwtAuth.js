const jwt = require('jsonwebtoken')

const cookieJwtAuth = (req, res, next) => {
    const access_token = req.cookies.token
    
    try {
        const user = jwt.verify(access_token, process.env.SECRET_KEY)
        req.user = user
        next()
    }
    catch (err) {
        res.clearCookie('token')
        return res.send('Fail')
    }
}
 
module.exports = {cookieJwtAuth}