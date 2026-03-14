import express from 'express' ;
import { isAuth, isSeller } from '../middlewares/isAuth.js';
import { addMenuItem } from '../controllers/menuitem.js';

const router = express.Router() ;

router.post('/new' , isAuth , isSeller , addMenuItem) ;
router.get("/all/:id" , isAuth , addMenuItem) ;

export default router ;