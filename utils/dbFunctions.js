const db = require('../db/database')

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

async function getUserFullName(id){
    const sql = `select name, surname from user where id = ${id}`
    const [result, _] = await db.execute(sql)

    const fullName = result[0].name + ' '  + result[0].surname
    return fullName
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

async function checkImageExistance(id)
{
    let sql = `select * from radiography where image_route = '${id}'`
    let [result, _] = await db.execute(sql)

    return result.length != 0
}

async function getRadiography(id){
    const sql = `select * from radiography where id = ${id}`
    const [result, _] = await db.execute(sql)

    return result[0]
}

async function getImagePath(id){
    const sql = `select image_route from radiography where id = ${id}`
    const [result, _] = await db.execute(sql)
    
    if(result[0]) return result[0].image_route
    return
}

module.exports = {validateEmail, checkUserExistance, getBodyPartId, checkImageExistance, getUserId, getUserFullName, getUserEmail, getRadiography, getImagePath}