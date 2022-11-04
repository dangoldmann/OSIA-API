const db = require('../db/database')
const {checkUserExistance, checkImageExistance} = require('../utils/dbFunctions')
const createError = require('http-errors')

class radiographyService {
    async create(radiographyInfo, next) {
        try{
            const {imageRoute, userId, date} = radiographyInfo
            
            const isUser = await checkUserExistance('id', userId)
            
            if(!isUser) return next(createError.BadRequest('User not found'))
            
            let sql = `insert into radiography (image_route, id_user, date) values ('${imageRoute}', ${userId}, '${date}')`
            await db.execute(sql)

            sql = `select id from radiography where image_route = '${imageRoute}'`
            const [result, _] = await db.execute(sql)

            const newRadiography = {
                id: result[0].id,
                imageRoute,
                userId
            }

            return newRadiography
        }
        catch(err){
            console.log(err.message)
        }
    }   

    async getAll(userId, next){
        try {
            const isUser = await checkUserExistance('id', userId)
            if(!isUser) return next(createError.BadRequest('User not found'))

            const sql = `select id, image_route, date from radiography where id_user = ${userId}`
            const [rows, _] = await db.execute(sql)

            return rows
        } catch (error) {
            console.log(error.message)
        }
    }

    async updateImageRoute(id, newImageRoute){
        try {
            const sql = `update radiography set image_route = '${newImageRoute}' where id = ${id}`
            await db.execute(sql)

            return true
        } catch (error) {
            console.log(error.message)
        }
    }

    async delete(id, next){
        try {
            const isImage = await checkImageExistance(id)
            if(!isImage) return next(createError.BadRequest('Radiography not found'))

            const sql = `delete from radiography where id = ${id}`
            await db.execute(sql)

            return true
        } catch (error) {
            console.log(error.message)
        }
    }
}

module.exports = new radiographyService()