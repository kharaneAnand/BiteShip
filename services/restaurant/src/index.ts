import express from 'express' ;
import dotenv from 'dotenv' ;
import connectDB from './config/db.js';
import restaurantRoute from './routes/restaurant.js';
import cors from 'cors' ;

dotenv.config() ;

const app = express() ;
app.use(cors()) ;
app.use(express.json()) ;

const PORT = process.env.PORT || 5001 ;

app.use("/api/restaurant" , restaurantRoute);

app.listen(PORT , ()=>{
    console.log(`Restaurant service is running on the ${PORT}`) ;
    connectDB() ;
});