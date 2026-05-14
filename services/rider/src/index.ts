import express from 'express' ;
import dotenv from 'dotenv' ;

dotenv.config() ;

const app = express() ;
const PORT = process.env.PORT || 5004 ;


app.listen(PORT ,()=>{
    console.log(`Rider service is running on ${PORT}`) ;
});

