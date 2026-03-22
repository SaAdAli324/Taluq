import express from 'express';
import http from 'http'
import { Server } from 'socket.io';
import passport from 'passport';
import { initializeSocket } from './socket/index.js';
import cookieParser from 'cookie-parser';
import cors from 'cors'
import dotenv from 'dotenv'
import connectDB from './config/db.js';

import { globalErrorHandler } from './middleware/error.middleWare.js';
import morgan from 'morgan';
import logger from './utils/logger.js';
import helmet from 'helmet';
import './config/passport.js'
import authRoute from './routes/authRoutes.js'
import profileRoute from './routes/profileRoutes.js'
import searchUserRoute from './routes/searchUserRoute.js'
import contactRoutes from './routes/contactRoutes.js'
dotenv.config()

connectDB()


const app: express.Application = express();
const server = http.createServer(app)
app.use(cookieParser())
app.use(helmet())
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));



app.use(express.json({ limit: "10kb" }))
app.use(express.urlencoded({ extended: true }))


const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"]
    }
})
initializeSocket(io)
if (process.env.NODE_ENV === "development") {
    app.use(morgan('dev'))
}


const PORT = process.env.PORT || 5000

app.use(passport.initialize())
app.use('/api/auth', authRoute)
app.use('/api/get', profileRoute)
app.use('/api/search', searchUserRoute)
app.use('/api/contacts', contactRoutes)




app.use(globalErrorHandler)
server.listen(PORT, () => {
    logger.info(`server running on ${PORT}`,)
})