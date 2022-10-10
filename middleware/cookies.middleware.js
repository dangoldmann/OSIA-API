const Redirect = require('../classes/Redirect')

const isLoggedIn = (req, res, next) => {
    if(req.cookies.access_token) {
        return res.send({redirect: new Redirect('./HomePage.html', 'You are already logged in')})
    }
}

module.exports = {isLoggedIn}