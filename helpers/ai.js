const fetch = require('node-fetch')
const {AIUrl} = require('../config')

const predictAI = async imagePath => {
    try {
        let res = await fetch(AIUrl, {
            method: 'POST',
            headers: {
                'Content-Type' : 'application/json'
            },
            body: JSON.stringify({
                imagePath
            })
        })

        res = await res.json()

        return res.image_base64
    } catch (error) {
        return {error: {message: error.message}}
    }
}

module.exports = {predictAI}