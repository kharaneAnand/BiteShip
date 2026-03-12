import express from 'express' 
import { isAuth, isSeller } from '../middlewares/isAuth.js';
import {addRestaurant, fetchMyRestaurant } from '../controllers/restaurant.js';
import uploadfile from '../middlewares/multer.js';

const router = express.Router() ;

router.post("/new" , isAuth ,isSeller, uploadfile , addRestaurant) ;
router.get("/my" , isAuth , isSeller , fetchMyRestaurant) ;

export default router ;