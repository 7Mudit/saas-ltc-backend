const express = require('express')
const app =express()
const connectToDb = require('./connect/connectToDb')
const cors = require('cors')
require('dotenv').config()


app.use(cors({
    origin : true,
    credentials : true
}))

connectToDb()

const router = require('./routes/route')
app.use('/api',router) 

const PORT = 8000 || process.env.PORT

app.listen(PORT , () => {
    console.log(`Server started on ${PORT}`)
})