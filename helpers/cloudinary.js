const cloudinary = require('cloudinary')

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

class Cloudinary {
    upload(file, folder) {
        return new Promise(resolve => {
            cloudinary.uploader.upload(file, result => {
                resolve({
                    url: result.url,
                    id: result.public_id
                })
            }, {
                use_filename: true,
                unique_filename: false,
                resource_type:'auto',
                folder
            })
        })
    }

    delete(file) {
        return new Promise(resolve => {
            cloudinary.uploader.destroy(file, result => {
                resolve({
                    result: result.result
                })
            })
        })
    }
}

module.exports = new Cloudinary()