import express from 'express' ;
import { isAuth, isSeller } from '../middlewares/isAuth.js';
import { addMenuItem, deleteMenuItem, toggleMenuItemAvailability } from '../controllers/menuitem.js';
import uploadfile from '../middlewares/multer.js';

const router = express.Router() ;

router.post('/new' , isAuth , isSeller , uploadfile , addMenuItem) ;
router.get("/all/:id" , isAuth , addMenuItem) ;
router.delete('/:id' , isAuth , isSeller , deleteMenuItem) ;
router.delete("/status/:id" , isAuth , isSeller , toggleMenuItemAvailability) ;

export default router ;