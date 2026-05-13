import express from 'express' ;
import { isAuth, isSeller } from '../middleware/isAuth.js';
import { createOrder, fetchOrderForPayment, fetchRestaurantOrders, getMyOrders, updateOrderStatus } from '../controllers/order.js';
import { fetchSingleRestaurant } from '../controllers/restaurant.js';


const router = express.Router() ;


router.get("/myorder" , isAuth , getMyOrders) ;
router.get("/:id" , isAuth , fetchSingleRestaurant) ;
router.post("/new" , isAuth , createOrder) ;
router.get("/payment/:id" , fetchOrderForPayment) ;
router.get("/:restaurantId",isAuth  , isSeller , fetchRestaurantOrders ) ;
router.put("/:orderId" , isAuth , isSeller , updateOrderStatus ) ;



export default router ;