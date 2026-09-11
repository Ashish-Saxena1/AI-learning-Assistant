import dotenv from 'dotenv'
dotenv.config()
import express from 'express'
import cors from 'cors'
import {connectDB} from './config/db.js'
import authRouter from './routes/auth.routes.js'
import documentRoute from './routes/document.routes.js'
import chatRoute from './routes/chat.routes.js'

import cookieParser from 'cookie-parser';
connectDB()

const app = express()


//MIDDLEWARES
app.use(cors({
    origin: ['http://localhost:5173','http://192.168.29.90:5173/'],
    credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

//ROUTES
app.use('/api/auth',authRouter)
app.use('/api/docs',documentRoute)
app.use('/api/chat',chatRoute)


const PORT=process.env.PORT
app.listen(PORT,()=>{
    console.log(`server is running on PORT ${PORT}` )
})