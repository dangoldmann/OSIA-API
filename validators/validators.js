const {body} = require('express-validator')

const signUpSchema = [
    body('name', 'Ingrese un nombre completo').isLength({min: 3}),
    body('surname', 'Ingrese un apellido completo').isLength({min: 4}),
    body('email', 'Ingrese un email valido').isEmail(),
    body('phone', 'Ingres un número de telefono válido').isMobilePhone(),
    //body('password', 'La contraseña debe de ser como mínimo de 6 caracteres').isLength({min: 6})
]

const logInSchema = [
    body('email', 'Ingrese un email valido').isEmail(),
    //body('password', 'La contraseña debe de ser como mínimo de 6 caracteres').isLength({min: 6})
]

module.exports = {signUpSchema, logInSchema}