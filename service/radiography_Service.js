const db = require('../db/database')
const {checkUserExistance, getBodyPartId, checkImageExistance} = require('../scripts/dbFunctions')
const createError = require('http-errors')

class radiographyService {
    async create(radiographyInfo, next) {
        try{
            const {imageRoute, bodyPart, userId} = radiographyInfo
            
            const isUser = await checkUserExistance('id', userId)
            
            if(!isUser) return next(createError.BadRequest('User not found'))

            const bodyPartId = await getBodyPartId(bodyPart)
            
            if(bodyPartId == -1) return next(createError.BadRequest('Body part not valid'))
            
            let sql = `insert into radiography (image_route, id_body_part, id_user) values ('${imageRoute}', ${bodyPartId}, ${userId})`
            await db.execute(sql)

            const newRadiography = {
                imageRoute,
                bodyPartId,
                userId
            }

            return newRadiography
        }
        catch(err){
            console.log(err.message)
        }
    }

    async getByUserId(userInfo, next){
        try{
            const {userId} = userInfo

            const isUser = await checkUserExistance('id', userId)
            
            if(!isUser) return next(createError.BadRequest('User not found'))

            let sql = `select image_route from radiography where id_user = ${userId}`
            var [imageRoutes, _] = await db.execute(sql)

            return imageRoutes
        }
        catch(err){
            console.log(err.message)
        }
    }

    async delete(radiographyInfo, next){
        try{
            const {imageRoute} = radiographyInfo

            const isImage = await checkImageExistance(imageRoute)
            if(!isImage) return next(createError.BadRequest('Image not found'))

            let sql = `delete from radiography where image_route = '${imageRoute}'`
            await db.execute(sql)

            return true
        }
        catch(err){
            console.log(err.message)
        }
    }
}

module.exports = new radiographyService()