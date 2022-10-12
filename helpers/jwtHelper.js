const jwt = require('jsonwebtoken')

const signToken = (userId, secret, expiresIn) => {
    const payload = {id: userId}
    const options = {expiresIn}

    return jwt.sign(payload, secret, options)
}

const verifyToken = (token, secret) => {
    try {
        return jwt.verify(token, secret)
    } catch (error) {
        return error
    }
}

const signAccessToken = userId => {
    const payload = {id: userId}
    const secret = process.env.ACCESS_TOKEN_SECRET
    const options = {expiresIn: '15m'}

    return jwt.sign(payload, secret, options)
}

const signRefreshToken = userId => {
    const payload = {id: userId}
    const secret = process.env.REFRESH_TOKEN_SECRET
    const options = {expiresIn: '1y'}

    return jwt.sign(payload, secret, options)
}

const signResetPasswordToken = userId => {
    const payload = {id: userId}
    const secret = process.env.RESET_PASSWORD_TOKEN_SECRET + userId
    const options = {expiresIn: '3h'}

    return jwt.sign(payload, secret, options)
}

const verifyAccessToken = accessToken => {
    try {
        return jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET)
    } catch (error) {
        return error
    }
}

const verifyRefreshToken = refreshToken => {
    try {
        return jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET)
    } catch (error) {
        return error
    }
}

const verifyResetPasswordToken = (resetPasswordToken, userId) => {
    try {
        const secret = process.env.RESET_PASSWORD_TOKEN_SECRET + userId
        return jwt.verify(resetPasswordToken, secret)
    } catch (error) {
        return error
    }
}

module.exports = {signAccessToken, signRefreshToken,signResetPasswordToken, verifyAccessToken, verifyRefreshToken, verifyResetPasswordToken}