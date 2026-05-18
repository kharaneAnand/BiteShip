import express from 'express' 
import { isAdmin, isAuth } from '../middleware/isAUth.js';
import { getPendingRestaurant, getPendingRiders, getVerifiedRestaurants, getVerifiedRiders, verifyRestaurant, verifyRider } from '../controllers/admin.js';

const router = express.Router() ;

router.get("/admin/restaurant/pending" , isAuth  , isAdmin , getPendingRestaurant) ;
router.get("/admin/rider/pending" , isAuth , isAdmin , getPendingRiders) ;
router.patch("/verify/rider/:id" , isAuth , isAdmin , verifyRider) ;
router.patch("/verify/restaurant/:id" , isAuth , isAdmin , verifyRestaurant) ;
router.get("/admin/restaurant/verified",isAuth,isAdmin,getVerifiedRestaurants);

router.get("/admin/rider/verified",isAuth,isAdmin, getVerifiedRiders);

export default router ;