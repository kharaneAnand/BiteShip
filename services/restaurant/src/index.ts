import express from 'express' ;
import dotenv from 'dotenv' ;
import connectDB from './config/db.js';
import restaurantRoutes from './routes/restaurant.js';
import ItemsRoutes from './routes/menuitem.js' ;
import CartRoutes from './routes/cart.js' ;
import AddressRoutes from './routes/address.js' ;
import orderRoutes from './routes/order.js' ;
import cors from 'cors' ;

dotenv.config() ;

const app = express() ;
app.use(cors()) ;
app.use(express.json()) ;

const PORT = process.env.PORT || 5001 ;

app.use("/api/restaurant" , restaurantRoutes);
app.use("/api/item" , ItemsRoutes) ;
app.use("/api/cart" , CartRoutes) ;
app.use("/api/address" , AddressRoutes ) ;
app.use("/api/order" , orderRoutes ) ;


app.listen(PORT , ()=>{
    console.log(`Restaurant service is running on the ${PORT}`) ;
    connectDB() ;
});