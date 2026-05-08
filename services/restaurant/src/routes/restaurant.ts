import express from 'express' ;
import { isAuth, isSeller } from '../middleware/isAuth.js';
import { addRestaurant, fetchMyRestaurant, updateRestaurant, updateStatusRestauarnt } from '../controllers/restaurant.js';
import uploadFile from '../middleware/multer.js';

const router = express.Router() ;

router.post("/new" , isAuth , isSeller , uploadFile , addRestaurant) ;
router.get("/my" , isAuth , isSeller , fetchMyRestaurant) ;
router.put("/status" , isAuth , isSeller , updateStatusRestauarnt) ;
router.put("/edit" , isAuth , isSeller ,updateRestaurant ) ;

export default router ;