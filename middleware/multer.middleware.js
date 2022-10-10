const path = require('path')
const multer = require('multer')
const jwt = require('jsonwebtoken')
const {ApiError} = require('../classes')
const fs = require('fs-extra')

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const access_token = req.cookies.access_token
        const user = jwt.verify(access_token, process.env.SECRET_KEY).user
        
        const path = `./public/images/${user.id}`
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
        const fileTypes = /jpeg|jpg|png/
        const mimetype = fileTypes.test(file.mimetype)
        const extname = fileTypes.test(path.extname(file.originalname))

        if(mimetype && extname) return cb(null, true)
        cb(ApiError.badRequest('El archivo debe ser una imagen valida'))
    }
}).single('image')



module.exports = {upload}
