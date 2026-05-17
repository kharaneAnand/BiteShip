import express from 'express' ;
import dotenv from 'dotenv' ;

dotenv.config() ;
const app = express() ;

const PORT = process.env.PORT || 5005 ;

app.listen(PORT , ()=>{
    console.log(`Admin service is running on Port ${process.env.PORT}`) ;
    
})