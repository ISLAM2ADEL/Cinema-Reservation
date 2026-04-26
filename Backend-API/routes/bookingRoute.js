const router = require('express').Router();
const bookingController = require('../controllers/bookingController');
const { protect } = require('../middlewares/authMiddleware'); 

router.post('/', protect, bookingController.createBooking);

module.exports = router;