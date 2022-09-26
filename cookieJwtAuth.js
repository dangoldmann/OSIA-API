const jwt = require('jsonwebtoken')

const cookieJwtAuth = (req, res, next) => {
    const token = req.cookies.token
    
    try {
        const user = jwt.verify(token, process.env.SECRET_KEY)
        req.user = user
        next()
    }
    catch (err) {
        res.clearCookie('token')
        return res.send('Fail')
    }
}
 
module.exports = {cookieJwtAuth}