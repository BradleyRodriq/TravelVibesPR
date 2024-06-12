require('dotenv').config()

const express = require('express')
const experiencesRoute = require('./routes/experienceRoutes')
const mongoose = require('mongoose')
const userRoute = require('./routes/userRoutes')
const vibesRoute = require ('./routes/vibeRoutes')
const googleRoutes = require('./routes/googleRoutes')

// express app create
const app = express()

// middleware
app.use(express.json())

app.use((req, res, next) => {
    console.log(req.path, req.method)
    next()
})

// routes connection
app.use('/api/experiences', experiencesRoute)
app.use('/api/user', userRoute)
app.use('/api/vibes', vibesRoute)
app.use('/api/googlefetch', googleRoutes)

// connect to db
mongoose.connect(process.env.MONGO_URI)
    .then(() => {

        // listen for requests
        app.listen(process.env.PORT, () => {
            console.log('Connected to database and listening on port', process.env.PORT)
        })
    })
    .catch((error) => {
        console.log(error)
    })
