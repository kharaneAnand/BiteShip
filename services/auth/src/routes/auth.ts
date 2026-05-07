import express from 'express' ;
import { loginUser } from '../controller/auth.js';
import { addUserRole, isAuth } from '../middleware/isAUth.js';

const router = express.Router() ;
router.post("/login" , loginUser) ;
router.put("/add/role" , isAuth , addUserRole) ;

export default router ;
