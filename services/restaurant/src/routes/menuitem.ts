import express from 'express' ;
import { isAuth, isSeller } from '../middleware/isAuth.js';
import { addMenuItem, deleteMenuItem, getAllItems, toggleMenuItemAvailability } from '../controllers/menuitem.js';
import uploadfile from '../middleware/multer.js';

const router = express.Router() ;

router.post('/new' , isAuth , isSeller , uploadfile , addMenuItem) ;
router.get("/all/:id" , isAuth , getAllItems) ;
router.delete('/:itemId' , isAuth , isSeller , deleteMenuItem) ;
router.put("/status/:itemId" , isAuth , isSeller , toggleMenuItemAvailability) ;

export default router ;