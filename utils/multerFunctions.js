const path = require('path')

const setImageName = file => {
    const date = new Date()
    const fullDate = `${date.getFullYear()}-${date.getMonth()}-${date.getDay()} ${date.getHours()}-${date.getMinutes()}`
    const imageName = file.originalname.split('.')[0]
    let extname = path.extname(file.originalname)
    if(extname == '.jfif') extname = '.jpg'

    return `${imageName} ${fullDate}${extname}`
}   

const filterImage = file => {
    const fileTypes = /jpeg|jpg|png|jfif/
    const mimetype = fileTypes.test(file.mimetype)
    const extname = fileTypes.test(path.extname(file.originalname))
       
    if(mimetype && extname) return true
    return false
}

module.exports = {setImageName, filterImage}