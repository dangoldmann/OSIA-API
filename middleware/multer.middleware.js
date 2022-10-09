const path = require('path')
const multer = require('multer')

const storage = multer.diskStorage({
    destination: path.join(__dirname, '../public/images'),
    filename: (req, file, cb) => {
        cb(null, file.originalname)
    }
})

const upload = multer({
    storage,
    dest: 'public/images',
    limits: {fileSize: 5000000}
}).single('image')


module.exports = {upload}
