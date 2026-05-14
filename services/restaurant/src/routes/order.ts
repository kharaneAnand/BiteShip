import express from 'express' ;
import { isAuth, isSeller } from '../middleware/isAuth.js';
import { createOrder, fetchOrderForPayment, fetchRestaurantOrders, getMyOrders, updateOrderStatus , fetchSingleOrder } from '../controllers/order.js';



const router = express.Router() ;


router.get("/myorder" , isAuth , getMyOrders) ;
router.get("/:id" , isAuth , fetchSingleOrder) ;
router.post("/new" , isAuth , createOrder) ;
router.get("/payment/:id" , fetchOrderForPayment) ;
router.get("/restaurant/:restaurantId",isAuth  , isSeller , fetchRestaurantOrders ) ;
router.put("/:orderId" , isAuth , isSeller , updateOrderStatus ) ;



export default router ;