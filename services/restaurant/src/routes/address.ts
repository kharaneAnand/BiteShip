import express from 'express'
import { isAuth } from '../middleware/isAuth.js';
import { addAddress, deleteAddress, getMyAddress } from '../controllers/address.js';


const router = express.Router() ;
router.post("/new" ,isAuth , addAddress ) ;
router.post("/:id" , isAuth , deleteAddress) ;
router.post("/all" , isAuth , getMyAddress) ;

export default router ; 