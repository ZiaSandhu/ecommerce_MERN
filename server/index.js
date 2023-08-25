require('dotenv').config()
const express = require('express')
const dbConnect = require('./database/connect')
const errorHandle = require('./middleware/errorHandle')
const router = require('./routes/index')
const {URI}  = require('./config/index')
const {PORT}  = require('./config/index')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const app = express()

const corsOptions = {
    credentials: true,
    origin: 'https://pridestore.vercel.app',
    methods: ['GET', 'POST', 'PUT', 'DELETE','PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  };

function start(){
    try {
        app.use(express.json({limit: '50mb'}))
        app.use(cors(corsOptions))
        app.use(cookieParser())
        app.use(router)
        dbConnect(URI)
        app.use('/assets',express.static('assets'))
        app.use(errorHandle)

        app.listen(PORT,()=>{
            console.log(`Server is connected to port : ${PORT}`);
        })
    } catch (error) {
        console.log(error)
    }
}
start();