const db = require('../db/db')

async function validateEmail(email){
    let sql = `select * from user where email = '${email}'`
    let [result, _] = await db.execute(sql)

    return result.length == 0
}

async function checkUserExistance(field, value)
{
    let sql = `select * from user where ${field} = '${value}'`
    let [result, _] = await db.execute(sql)
    
    return result.length != 0
}

async function getUserId(field, value){
    let sql = `select id from user where ${field} = '${value}'`
    let [result, _] = await db.execute(sql)

    return result[0].id
}

async function getUserEmail(field, value){
    let sql = `select email from user where ${field} = '${value}'`
    let [result, _] = await db.execute(sql)
    
    return result[0].email
}

async function getBodyPartId(name)
{
    let sql = `select id from body_part where name = '${name}'`
    let [result, _] = await db.execute(sql)
    
    try { return result[0].id }
    catch { return -1}
}

async function checkImageExistance(imageRoute)
{
    let sql = `select * from radiography where image_route = '${imageRoute}'`
    let [result, _] = await db.execute(sql)

    return result.length != 0
}

module.exports = {validateEmail, checkUserExistance, getBodyPartId, checkImageExistance, getUserId, getUserEmail}