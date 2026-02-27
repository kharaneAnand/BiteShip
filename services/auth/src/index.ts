import express from 'express' 
import dotenv from 'dotenv' 
import connectDB from './config/db.js';

dotenv.config() ;

const app = express() ;

const PORT = process.env.PORT || 5000 ;

app.listen( PORT , ()=>{
   console.log(`Auth service is running on port ${PORT}`) ;
   connectDB() ;
}) ;