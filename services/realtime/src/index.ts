import express from 'express' 
import dotenv from 'dotenv' ;
import cors from 'cors' ;
import http from 'http'
import { initSocket } from './socket.js';
import internalRoutes from './routes/internal.js'

dotenv.config() ;
const app = express() ;

app.use(cors()) ;
app.use(express.json()) ;

app.use("/api/v1/internal" , internalRoutes ) ;

const server = http.createServer(app) ;
initSocket(server) ;

const PORT = process.env.PORT || 5003 ;
server.listen(PORT , ()=>{
    console.log(`Realtime service is running on the port ${PORT}`)
})