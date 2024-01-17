import express, { Express, Request, Response, NextFunction } from 'express'
import helmet from 'helmet'
import cors from 'cors'
import morgan from 'morgan'
import bodyParser from 'body-parser'
import * as dotenv from 'dotenv'
import compression from 'compression'
import ExpressMongoSanitize from 'express-mongo-sanitize'
import { Routes } from './routes'
import Database from './dbs/config.mongodb'

dotenv.config()
const app: Express = express()

//  connect mongodb
Database.getInstance()

app.use(
  cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
  })
)
// gzip compression
app.use(compression())

// set security HTTP headers
app.use(helmet())
app.use(morgan('dev'))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// sanitize request data
app.use(ExpressMongoSanitize())

app.use('/api', Routes)

app.use((req: Request, res: Response, next) => {
  const err: any = new Error('Not Found') //error message
  err.status = 404 //error status
  next(err) // send err data to another middleware handling
})

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  const status = err.status || 500
  console.trace(err)
  return res.status(status).json({
    status: 'error',
    code: status,
    stack: err.stack,
    message: err.message || 'Internal server error'
  })
})

const PORT = process.env.PORT || 3500

const server = app.listen(PORT, () => {
  console.log(`Server is start at PORT: ${PORT}`)
})

process.on('SIGINT', () => {
  Database.disconnect()
  server.close(() => console.log('Exit Server Express'))
})
