const {body} = require('express-validator')

const signUpSchema = [
    body('name', 'El nombre debe contener entre 3 y 15 caracteres').isLength({min: 3, max: 15}),
    body('surname', 'El apellido debe contener entre 4 y 25 caracteres').isLength({min: 4, max: 25}),
    body('email', 'Ingrese un email valido').isEmail(),
    body('phone', 'Ingres un número de telefono válido').isMobilePhone(),
    body('password', 'La contraseña debe contener entre 6 y 30 caracteres').isLength({min: 6, max: 30})
]

const logInSchema = [
    body('email', 'Ingrese un email valido').isEmail()
]

module.exports = {signUpSchema, logInSchema}