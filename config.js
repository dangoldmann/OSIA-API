//const apiBaseUrl = 'http://localhost:3000'
const apiBaseUrl = 'https://osia-api-production.up.railway.app'

const AIUrl = 'https://osia-api-production.up.railway.app:5859/predict'

const refreshTokenCookieOptions = {
    httpOnly: true,
    maxAge: process.env.REFRESH_TOKEN_MAX_AGE,
    sameSite: 'none',
    secure: true
}

module.exports = {apiBaseUrl, AIUrl, refreshTokenCookieOptions}