import express from 'express' ;
import dotenv from 'dotenv' ;
import connectDB from './config/db.js';
import cors from 'cors' ;
import riderRoutes from './routes/rider.js'
import { connectRabbitMQ } from './config/rabbitmq.js';

dotenv.config() ;

await connectRabbitMQ()

const app = express() ;
app.use(express.json()) ;
app.use(cors()) ;


app.use("/api/rider" , riderRoutes) ;

const PORT = process.env.PORT || 5004 ;

app.listen(PORT , ()=>{
    console.log(`Rider service is running on the ${PORT}`) ;
    connectDB() ;
})
