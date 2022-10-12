const bcrypt = require('bcrypt')
const db = require('../db/database')
const {validateEmail, checkUserExistance} = require('../utils/dbFunctions')
const createError = require('http-errors')

class userService {
    async getAll() {
        let sql = `select * from user`
        const [users, _] = await db.execute(sql)
        return users
    }

    async create(userInfo, next) {
        try {
            const {name, surname, email, phone, password} = userInfo
        
            const hashedPassword = bcrypt.hashSync(password, 10)

            const isEmailValid = await validateEmail(email)
            if(!isEmailValid) return next(createError.BadRequest('User already exists with that email adress'))
       
            let sql = `insert into user (name, surname, email, phone, password) values ('${name}', '${surname}', '${email}', '${phone}', '${hashedPassword}')`
            await db.execute(sql)

            sql = `select * from user where email = '${email}'`
            const [result, _] = await db.execute(sql)
            const newUser = result[0]

            return newUser
        }
        catch (err) {
            console.log(err.message)
        }
    }

    async updatePassword(userInfo, next){
        try
        {
            const {email, newPassword} = userInfo

            const isUser = await checkUserExistance('email', email)
            if(!isUser) return next(createError.BadRequest('User not found'))

            const hashedNewPassword = bcrypt.hashSync(newPassword, 10)

            let sql = `update user set password = '${hashedNewPassword}' where email = '${email}'`
            await db.execute(sql)

            return isUser
        }
        catch (err) {
            console.log(err.message)
        }
    }

    async delete(userInfo, next) {
        try {
            const {email} = userInfo

            const isUser = await checkUserExistance('email', email)
            if(!isUser) return next(createError.BadRequest('User not found'))

            let sql = `delete from user where email = '${email}'`
            await db.execute(sql)

            return true
        }
        catch (err){
            console.error(err.message)
        }
    }
}

module.exports = new userService()
