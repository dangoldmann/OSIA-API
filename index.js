require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const {Redirect} = require('./classes');
const createError = require('http-errors')
const errorHandler = require('./middleware/error.middleware');
const {router: userRoutes, basePath: userBasePath} = require('./routes/users');
const {router: radiographyRoutes, basePath: radiographyBasePath} = require('./routes/radiographies');
const {router: cookiesTestRoutes, basePath: cookiesTestBasePath} = require('./test/cookiesTest');
const {router: imagesTestRoutes, basePath: imagesTestBasePath} = require('./test/uploadImages');

// SETTINGS
app.set('view engine', 'ejs')

// MIDDLEWARES
app.use(express.json())
app.use(cors({
    origin: 'http://127.0.0.1:5500',
    credentials: true
}))
app.use(cookieParser())
app.use(bodyParser.urlencoded({extended: false}))


// ROUTES
app.get('/', (req, res) => {
    if(!req.cookies.access_token && req.get('origin') === 'http://127.0.0.1:5500'){  
        return res.send({redirect: new Redirect('./LogIn.html', 'You are not logged in')})
    }
})  
app.use(userBasePath, userRoutes)
app.use(radiographyBasePath, radiographyRoutes)
app.use(cookiesTestBasePath, cookiesTestRoutes)
app.use(imagesTestBasePath, imagesTestRoutes)
app.use((req, res, next) => {
    console.log(req.path)
    next(createError.NotFound())
})

// ERROR HANDLING
app.use(errorHandler)

// STARTING THE SERVER
app.listen(process.env.PORT, () => console.log(`Listening on port ${process.env.PORT}...`))
