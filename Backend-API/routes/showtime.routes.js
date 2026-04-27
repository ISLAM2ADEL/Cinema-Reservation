import express from 'express';
import { createShowtime ,
     getAllShowtimes ,
      getShowtimeById , 
      updateShowtime , 
      deleteShowtime } from '../controllers/showtime.controller.js';
import { protect, authorize } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/', protect, authorize('admin'), createShowtime);
router.get('/', getAllShowtimes);
router.get('/:id', getShowtimeById);
router.put('/:id', protect, authorize('admin'), updateShowtime);
router.delete('/:id', protect, authorize('admin'), deleteShowtime);

export default router;