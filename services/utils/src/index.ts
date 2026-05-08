import express from 'express' ;
import dotenv from 'dotenv' ;
import cloudinary from 'cloudinary' ;
import cors from 'cors' ;
import uploadRoutes from './routes/cloudinary.js' ;

dotenv.config() ;

const app = express() ;

app.use(cors()) ;

app.use(express.json({limit:"50mb" })) ;
app.use(express.urlencoded({limit:"50mb" , extended:true})) ;

const { CLOUD_NAME , CLOUD_API_KEY , CLOUD_SECRET_KEY} = process.env ;

if(!CLOUD_NAME || !CLOUD_API_KEY || !CLOUD_SECRET_KEY) {
   throw new Error("Missing CLoudinary enviroment variables") ;
}



cloudinary.v2.config({
   cloud_name : CLOUD_NAME ,
   api_key : CLOUD_API_KEY ,
   api_secret:CLOUD_SECRET_KEY,
});

app.use("/api" , uploadRoutes) ;


const PORT = process.env.PORT || 5002 ;

app.listen( PORT , ()=>{
   console.log(`Utils service is running on port ${PORT}`) ;
}) ;


