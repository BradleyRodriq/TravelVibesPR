require('dotenv').config()

const express = require('express')
const experiencesRoute = require('./routes/experienceRoutes')
const mongoose = require('mongoose')

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
