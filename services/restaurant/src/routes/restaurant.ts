import express from 'express' ;
import { isAuth, isSeller } from '../middleware/isAuth.js';
import { addRestaurant } from '../controllers/restaurant.js';

const router = express.Router() ;

router.post("/new" , isAuth , isSeller , addRestaurant) ;

export default router ;