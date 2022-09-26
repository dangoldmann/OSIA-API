require('dotenv').config()
const express = require('express')
const app = express();
const cors = require('cors')
const cookieParser = require('cookie-parser')
const apiErrorHandler = require('./error/api-error-handler');
const ApiError = require('./error/ApiError');
const {router: userRoutes, basePath: userBasePath} = require('./routes/users')
const {router: radiographyRoutes, basePath: radiographyBasePath} = require('./routes/radiographies')
const {router: testRoutes, basePath: testBasePath} = require('./test')

// middleware
app.use(express.json())
app.use(cors())
app.use(cookieParser())

//routes
app.use(userBasePath, userRoutes)
app.use(radiographyBasePath, radiographyRoutes)
app.use(testBasePath, testRoutes)

app.use((req, res, next) => {
    console.log(req.path)
    const error = new ApiError(404, 'Not found')
    next(error)
})

app.use(apiErrorHandler)

// starting the server
app.listen(process.env.PORT, () => console.log(`Listening on port ${process.env.PORT}...`))
