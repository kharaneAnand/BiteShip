import express from 'express' ;
import { loginUser } from '../controllers/auth.js';
import { addUserRole, isAuth } from '../middlewares/isAuth.js';

const router = express.Router() ;

router.post("/login" , loginUser) ;
router.put("/add/role" , isAuth , addUserRole) ;

export default router ;