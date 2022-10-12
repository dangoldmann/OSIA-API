//const apiBaseUrl = 'http://localhost:3000'
const apiBaseUrl = 'https://osia-api-production.up.railway.app'

const cookieOptions = {
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24 * 7,
    sameSite: 'none',
    secure: true
}

module.exports = {apiBaseUrl, cookieOptions}