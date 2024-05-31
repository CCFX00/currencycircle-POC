import app from './app'
import dotenv from 'dotenv'

// handling uncaught exceptions
process.on('uncaughtException', (err: Error) => {
    console.log(`Shutting down server: ${err.message}`)
    console.log(`Shutting down server for handling uncaught exception`)
})

dotenv.config({
    path: 'src/config/.env'
})

const server = app.listen(process.env._PORT, () => {
    console.log(`Server running on http://localhost:${process.env._PORT}`)
})

// unhandled promise rejection
process.on('unhandledRejection', (err: Error) => {
    console.log(`Shutting down server for ${err.message}`);
    console.log(`Shutting down server for unhandled promise rejection`)
    server.close(() => {
        process.exit(1)
    })
})
