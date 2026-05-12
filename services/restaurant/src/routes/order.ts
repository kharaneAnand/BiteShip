import express from 'express' ;
import { isAuth } from '../middleware/isAuth.js';
import { createOrder, fetchOrderForPayment } from '../controllers/order.js';


const router = express.Router() ;
router.post("/new" , isAuth , createOrder) ;
router.get("/payment/:id" , fetchOrderForPayment) ;

export default router ;