const path = require('path')
const multer = require('multer')
const {ApiError} = require('../classes')

const storage = multer.diskStorage({
    destination: path.join(__dirname, '../public/images'),
    filename: (req, file, cb) => {
        cb(null, file.originalname)
        //cb(null, `${file.fieldname} - ${Date.now().To} ${path.extname(file.originalname)}`)
    }
})

const upload = multer({
    storage,
    dest: 'public/images',
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
