const radiography_Service = require('../service/radiography_Service')

class radiographyController {
    create(radiographyInfo, next){
        return radiography_Service.create(radiographyInfo, next)
    }

    getAll(userId, next){
        return radiography_Service.getAll(userId, next)
    }

    delete(id, next){
        return radiography_Service.delete(id, next)
    }
}

module.exports = new radiographyController()