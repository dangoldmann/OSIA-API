const multer = require('multer')
const createError = require('http-errors')
const fs = require('fs-extra')
const {setImageName, filterImage} = require('../utils/multerFunctions')

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const path = `./public/images/${req.userId}`
        fs.mkdirsSync(path)
        cb(null, path)
    },
    filename: (req, file, cb) => {
        const fullImageName = setImageName(file)
        cb(null, fullImageName)
    }
})

const upload = multer({
    storage,
    limits: {fileSize: 5000000},
    fileFilter: (req, file, cb) => {
        const isValid = filterImage(file)
        if(isValid) return cb(null, true)
        cb(createError.BadRequest('El archivo debe ser una imagen valida'))
    }
}).single('image')

module.exports = {upload}
