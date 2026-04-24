import express from 'express';
import { createHall , getAllHalls,deleteHall} from '../controllers/hall.controller.js';

import { protect, authorize } from '../middlewares/auth.middleware.js';

const router = express.Router();


router.post('/', protect, authorize('admin'), createHall);
router.get('/',  getAllHalls);
router.delete('/:id', protect, authorize('admin'), deleteHall);
export default router;