import express from 'express';
import { createShowtime ,
     getAllShowtimes ,
      getShowtimeById , 
      updateShowtime , 
      deleteShowtime } from '../controllers/showtime.controller.js';

const router = express.Router();

router.post('/', createShowtime);
router.get('/', getAllShowtimes);
router.get('/:id', getShowtimeById);
router.put('/:id', updateShowtime);
router.delete('/:id', deleteShowtime);

export default router;