import express from 'express' ;
import dotenv from 'dotenv' ;
import adminRouter from './routes/admin.js'
import cors from 'cors' ;

dotenv.config() ;
const app = express() ;

app.use(cors()) ;
app.use('/api/v1' , adminRouter) ;

const PORT = process.env.PORT || 5005 ;


app.listen(PORT , ()=>{
    console.log(`Admin service is running on Port ${process.env.PORT}`) ;
    
})