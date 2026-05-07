import express from 'express' ;
import dotenv from 'dotenv' ;
import connectDB from './config/db.js';
import authRouter from './routes/auth.js'

dotenv.config() ;
const app = express() ;


app.use(express.json()) ;
app.use("/api/auth" , authRouter) ;

const PORT = process.env.PORT || 5000 ;

app.listen(PORT , ()=>{
    console.log(`Auth Service is running on the ${PORT}`) ;
    connectDB();
});

