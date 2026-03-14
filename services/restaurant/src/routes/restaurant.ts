import express from 'express' 
import { isAuth, isSeller } from '../middlewares/isAuth.js';
import {addRestaurant, fetchMyRestaurant, UpdateRestaurant, updateStatusRestaurant } from '../controllers/restaurant.js';
import uploadfile from '../middlewares/multer.js';

const router = express.Router() ;

router.post("/new" , isAuth ,isSeller, uploadfile , addRestaurant) ;
router.get("/my" , isAuth , isSeller , fetchMyRestaurant) ;
router.put("/status" , isAuth , isSeller , updateStatusRestaurant) ;
router.put("/edit" , isAuth , isSeller , UpdateRestaurant) ;


export default router ;