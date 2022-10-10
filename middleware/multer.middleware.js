const path = require('path')
const multer = require('multer')

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
        if(file.mimetype == 'image/png' || file.mimetype == 'image/jpg' || file.mimetype == 'image/jpeg') return cb(null, true)
        return cb(new Error('El archivo debe ser .png, .jgp o .jpeg'))
    }
}).single('image')


module.exports = {upload}
