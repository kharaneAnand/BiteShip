import express from 'express' ;
import { isAuth, isSeller } from '../middleware/isAuth.js';
import { createOrder, fetchOrderForPayment, fetchRestaurantOrders, updateOrderStatus } from '../controllers/order.js';


const router = express.Router() ;
router.post("/new" , isAuth , createOrder) ;
router.get("/payment/:id" , fetchOrderForPayment) ;
router.get("/:restaurantId",isAuth  , isSeller , fetchRestaurantOrders ) ;
router.put("/:orderId" , isAuth , isSeller , updateOrderStatus ) ;


export default router ;