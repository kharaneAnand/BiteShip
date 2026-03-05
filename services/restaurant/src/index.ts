import express from 'express' ;
import connectDB from './config/db.js';
import dotenv from 'dotenv'


dotenv.config() ;

const app  = express() ;
const PORT = process.env.PORT || 5001 ;

app.listen( PORT , ()=>{
   console.log(`Restaurant service is running on port ${PORT}`) ;
   connectDB() ;
}) ;