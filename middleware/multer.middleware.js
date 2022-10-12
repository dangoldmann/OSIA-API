const path = require('path')
const multer = require('multer')
const createError = require('http-errors')
const fs = require('fs-extra')

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const path = `./public/images/${req.userId}`
        fs.mkdirsSync(path)
        cb(null, path)
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname)
        //cb(null, `${file.fieldname} - ${Date.now().To} ${path.extname(file.originalname)}`)
    }
})

const upload = multer({
    storage,
    limits: {fileSize: 5000000},
    fileFilter: (req, file, cb) => {
        const fileTypes = /jpeg|jpg|png|jfif/
        const mimetype = fileTypes.test(file.mimetype)
        const extname = fileTypes.test(path.extname(file.originalname))
       
        if(mimetype && extname) return cb(null, true)
        cb(createError.BadRequest('El archivo debe ser una imagen valida'))
    }
}).single('image')

module.exports = {upload}
