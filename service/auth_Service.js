const db = require('../db/database')
const bcrypt = require('bcrypt')
const createError = require('http-errors')
const {validateEmail} = require('../utils/dbFunctions')

class authService {
    async register(userInfo, next) {
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

