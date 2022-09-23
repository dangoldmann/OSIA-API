require('dotenv').config()
const express = require('express')
const app = express();
const cors = require('cors')
const cookieParser = require('cookie-parser')
const jwt = require('jsonwebtoken')
const apiErrorHandler = require('./error/api-error-handler');
const ApiError = require('./error/ApiError');
const {router: userRoutes, basePath: userBasePath} = require('./routes/users')
const {router: radiographyRoutes, basePath: radiographyBasePath} = require('./routes/radiographies')
const {cookieJwtAuth} = require('./cookieJwtAuth')

// middleware
app.use(express.json())
app.use(cors())
app.use(cookieParser())

//routes
app.use(userBasePath, userRoutes)
app.use(radiographyBasePath, radiographyRoutes)

app.get('', (req, res) => {
    const user = {
        id: 1,
        name: 'name'
    }

    const token = jwt.sign({user}, process.env.SECRET_KEY, {expiresIn: '24h'})

    res.cookie('token', token, {
        httpOnly: true,
        maxAge: 86400
    })

    res.redirect('/home')

})

app.get('/home', cookieJwtAuth, (req, res) => {
    
    res.send('You are in the Home Page')
})

app.use((req, res, next) => {
    console.log(req.path)
    const error = new ApiError(404, 'Not found')
    next(error)
})

app.use(apiErrorHandler)


// starting the server
app.listen(process.env.PORT, () => console.log(`Listening on port ${process.env.PORT}...`))
