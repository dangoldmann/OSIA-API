const auth_Service = require('../service/auth_Service')

class authController {
    register(userInfo, next){
        return auth_Service.register(userInfo, next)
    }

    login(userInfo, next) {
        return authService.login(userInfo, next)
    }
}

module.exports = new authController()