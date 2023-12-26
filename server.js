import express  from 'express'
import bodyParser from 'body-parser'
import mongoose from 'mongoose'
import cors from 'cors'
import dotenv from 'dotenv'
import userRoutes from './routes/userRoutes.js'
import { errorHandler, notFound } from './middleware/errorMiddleware.js'

const app = express()

dotenv.config()

app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true}))

//user routes
app.use('/api/users', userRoutes)

//middleware
app.use(notFound)
app.use(errorHandler)

mongoose
    .connect(process.env.MONGO_URI)
    .then( () => {
        app.listen(process.env.PORT)
    })
    .catch(err => console.log(err))
