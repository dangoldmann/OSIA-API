const authService = require('../service/auth_Service')

class authController {
    login(userInfo, next) {
        return authService.login(userInfo, next)
    }
}

module.exports = new authController()