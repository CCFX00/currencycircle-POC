import express, { Express, Request, Response, NextFunction } from 'express'
import nunjucks from 'nunjucks'
import ErrorHandler from './middleware/error'
import cookieParser from 'cookie-parser'

const app: Express = express()

app.use(express.json())
app.use(cookieParser())

// Serve static files
app.use(express.static('src/public'))
app.use(express.urlencoded({ extended: true }))

// Configure Nunjucks
nunjucks.configure('src/views', {
    autoescape: true,
    express: app
});

// Set view engine to Nunjucks
app.set('view engine', 'njk')

// importing routes
import userRoutes from './routes/userRoutes'

app.use(userRoutes)

app.use(ErrorHandler)

export default app;