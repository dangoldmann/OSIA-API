const user_Service = require('../service/user_Service')

class userController {
    getAll(){
        return user_Service.getAll()
    }

    getFullName(userId){
        return user_Service.getFullName(userId)
    }

    getUserInfo(userId, next){
        return user_Service.getUserInfo(userId, next)
    }

    updatePassword(userInfo, next){
        return user_Service.updatePassword(userInfo, next)
    }

    delete(userInfo, next){
        return user_Service.delete(userInfo, next)
    }
}

module.exports = new userController()