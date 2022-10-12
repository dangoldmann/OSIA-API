const db = require('../db/database')
const bcrypt = require('bcrypt')
const createError = require('http-errors')

class authService {
    async login(userInfo, next){
        try
        {
            const {email, password} = userInfo
    
            let sql = `select * from user where email = '${email}'`
            const [result, _] = await db.execute(sql)
            const user = result[0]
    
            if(!user) return next(createError.BadRequest('User not found'))
            
            if(!bcrypt.compareSync(password, user.password)) return next(createError.BadRequest('Invalid password'))
    
            return user
        }
        catch (err){
            console.log(err.message)
        }
        
    }
}

module.exports = new authService()

