const express = require('express');
const router = express.Router();
const { getUserBookings, createBooking } = require('../controller/bookingController');
const { authenticateToken } = require('../middlewares/authMiddleware');

router.get('/', authenticateToken, getUserBookings); 
router.post('/', authenticateToken, createBooking);


module.exports = router;