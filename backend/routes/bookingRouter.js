const express = require('express');
const router = express.Router();
const { getUserBookings, createBooking } = require('../controller/bookingController');
const { authenticateToken } = require('../middlewares/authMiddleware');


// Protected routes (require JWT auth)
router.get('/', authenticateToken, getUserBookings); // Changed from authMiddleware to authenticateToken
router.post('/', authenticateToken, createBooking);


module.exports = router;