import express from 'express' ;
import dotenv from 'dotenv' ;
import connectDB from './config/db.js';
import cors from 'cors' ;

dotenv.config() ;

const app = express() ;
app.use(express.json()) ;
app.use(cors()) ;


const PORT = process.env.PORT || 5004 ;

app.listen(PORT , ()=>{
    console.log(`Rider service is running on the ${PORT}`) ;
    connectDB() ;
})
