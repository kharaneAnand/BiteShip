import express from 'express' 
import { isAuth } from '../middleware/isAuth.js';
import { addToCart, fetchMyCart } from '../controllers/cart.js';

const router = express.Router() ;

router.post("/add" , isAuth , addToCart) ;
router.post("/all" , isAuth , fetchMyCart) ;

export default router ;